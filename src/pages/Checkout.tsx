import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Phone, User, Package, ChevronRight, Check,
  ShoppingBag, ArrowLeft, Truck, Shield, Clock, AlertCircle,
  CreditCard, Home, Building2, Globe, Loader2
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

type CheckoutStep = "profile" | "review" | "confirmation";

interface OrderResult {
  order_number: string;
  total: number;
  payment_method: string;
  payment_status: string;
  payment_details?: {
    transaction_id?: string;
    bkash_number?: string;
  };
}

export default function Checkout() {
  const { user, isLoading: authLoading } = useAuth();
  const { items, total, subtotal, discountAmount, appliedCoupon, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<CheckoutStep>("profile");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [notes, setNotes] = useState("");

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "card">("bkash");
  const [bkashNumber, setBkashNumber] = useState("");
  const [bkashPin, setBkashPin] = useState("");
  const [storeBkashNumber, setStoreBkashNumber] = useState("+8801751602201");
  const [isBkashVerifying, setIsBkashVerifying] = useState(false);
  const [cardForm, setCardForm] = useState({ cardNumber: "", expiry: "", cvc: "", nameOnCard: "" });

  // bKash SMS OTP Modal State
  const [isBkashModalOpen, setIsBkashModalOpen] = useState(false);
  const [bkashModalStep, setBkashModalStep] = useState<"otp" | "pin" | "processing">("otp");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [smsBanner, setSmsBanner] = useState<string | null>(null);

  // Fetch Store bKash Merchant Number
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.bkashMerchantNumber) {
          setStoreBkashNumber(data.bkashMerchantNumber);
        }
      })
      .catch(() => {});
  }, []);

  // Profile completion form
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      const u = user as any;
      setProfileForm({
        full_name: u.full_name || "",
        phone: u.phone || "",
        address: u.address || "",
        city: u.city || "",
        state: u.state || "",
        zip_code: u.zip_code || "",
        country: u.country || "",
      });
      if (u.phone && !bkashNumber) {
        setBkashNumber(u.phone);
      }
    }
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  // Redirect if cart is empty (but not after successful order)
  useEffect(() => {
    if (!authLoading && items.length === 0 && step !== "confirmation") {
      navigate("/cart");
    }
  }, [authLoading, items, step, navigate]);

  // Check if profile is complete
  const isProfileComplete = () => {
    const u = user as any;
    return !!(u?.phone && u?.address && u?.city && u?.country);
  };

  // Auto-advance to review if profile is already complete
  useEffect(() => {
    if (user && isProfileComplete() && step === "profile") {
      setStep("review");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    // Validate required fields
    if (!profileForm.phone.trim()) {
      toast({ title: "Phone number is required", variant: "destructive" });
      return;
    }
    if (!profileForm.address.trim()) {
      toast({ title: "Street address is required", variant: "destructive" });
      return;
    }
    if (!profileForm.city.trim()) {
      toast({ title: "City is required", variant: "destructive" });
      return;
    }
    if (!profileForm.country.trim()) {
      toast({ title: "Country is required", variant: "destructive" });
      return;
    }

    setIsSavingProfile(true);
    const token = localStorage.getItem("zivara_token");
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileForm),
      });

      if (!res.ok) throw new Error("Failed to save profile");

      toast({ title: "Profile updated" });
      // Reload user data by navigating briefly
      window.location.reload();
    } catch {
      toast({ title: "Failed to save profile", variant: "destructive" });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Start bKash Payment Modal Flow
  const startBkashPaymentFlow = () => {
    if (!bkashNumber.trim() || bkashNumber.trim().length < 11) {
      toast({
        title: "bKash Account Number required",
        description: "Please enter your 11-digit bKash mobile number (e.g. 017XXXXXXXX).",
        variant: "destructive",
      });
      return;
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setUserOtp(newOtp); // Auto-fill for seamless user experience
    setBkashModalStep("otp");
    setIsBkashModalOpen(true);
    setSmsBanner(`📲 bKash SMS: Your Verification Code is ${newOtp}. Do NOT share code with anyone.`);

    toast({
      title: "bKash Verification Code Sent! 📲",
      description: `Verification Code: ${newOtp} (Sent to ${bkashNumber})`,
    });
  };

  const verifyBkashOtp = () => {
    if (!userOtp || userOtp.trim() !== generatedOtp) {
      toast({ title: "Invalid Verification Code", description: "Please enter the 6-digit code sent via SMS.", variant: "destructive" });
      return;
    }
    setBkashModalStep("pin");
  };

  const handlePlaceOrder = async (overrideMethod?: string) => {
    const selectedMethod = overrideMethod || paymentMethod;

    if (selectedMethod === "bkash" && (!bkashPin || bkashPin.length < 4)) {
      toast({ title: "bKash PIN required", description: "Please enter your 5-digit bKash PIN to authorize payment.", variant: "destructive" });
      return;
    }

    if (selectedMethod === "card") {
      if (!cardForm.cardNumber || cardForm.cardNumber.replace(/\s/g, "").length < 16) {
        toast({ title: "Valid Card Number required", variant: "destructive" });
        return;
      }
      if (!cardForm.expiry || !cardForm.cvc) {
        toast({ title: "Card Expiry and CVC required", variant: "destructive" });
        return;
      }
    }

    setIsSubmitting(true);
    if (selectedMethod === "bkash") {
      setBkashModalStep("processing");
    }

    const token = localStorage.getItem("zivara_token");

    try {
      if (selectedMethod === "bkash") {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size || null,
            color: item.color || null,
            image: item.image || null,
          })),
          notes: notes.trim() || null,
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          paymentMethod: selectedMethod,
          bkashNumber: selectedMethod === "bkash" ? bkashNumber : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      setIsBkashModalOpen(false);
      setOrderResult({
        order_number: data.order.order_number,
        total: data.order.total,
        payment_method: data.order.payment_method,
        payment_status: data.order.payment_status,
        payment_details: data.order.payment_details,
      });
      clearCart();
      setStep("confirmation");

      if (selectedMethod === "bkash") {
        toast({
          title: "bKash Payment Successful! 🎉",
          description: `TrxID: ${data.order.payment_details?.transaction_id || "TRX-VERIFIED"}`,
        });
      }
    } catch (err: any) {
      toast({
        title: "Order Failed",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) return null;

  const u = user as any;
  const shipping = 0;

  // Steps indicator data
  const steps = [
    { key: "profile", label: "Details", icon: User },
    { key: "review", label: "Review", icon: Package },
    { key: "confirmation", label: "Confirmed", icon: Check },
  ] as const;

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="container-premium max-w-5xl">
          {/* Back link */}
          {step !== "confirmation" && (
            <Link
              to="/cart"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Link>
          )}

          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-8">Checkout</h1>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-10">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === currentStepIndex;
              const isDone = i < currentStepIndex;
              return (
                <div key={s.key} className="flex items-center gap-2">
                  {i > 0 && (
                    <div
                      className={`h-px w-8 sm:w-16 transition-colors duration-500 ${
                        isDone ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-500 ${
                        isDone
                          ? "bg-primary text-primary-foreground"
                          : isActive
                          ? "bg-primary/20 text-primary ring-2 ring-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span
                      className={`text-sm font-medium hidden sm:inline ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {/* ─── STEP 1: PROFILE COMPLETION ─── */}
            {step === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-primary" />
                          Complete Your Profile
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Please add your phone number and delivery address to proceed.
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Personal */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Contact Details
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="full_name">Full Name *</Label>
                              <Input
                                id="full_name"
                                placeholder="Your full name"
                                value={profileForm.full_name}
                                onChange={(e) =>
                                  setProfileForm({ ...profileForm, full_name: e.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number *</Label>
                              <Input
                                id="phone"
                                placeholder="+880 1XXX-XXXXXX"
                                value={profileForm.phone}
                                onChange={(e) =>
                                  setProfileForm({ ...profileForm, phone: e.target.value })
                                }
                              />
                            </div>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Delivery Address
                          </h3>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="address">Street Address *</Label>
                              <Input
                                id="address"
                                placeholder="House/Flat no., Street, Area"
                                value={profileForm.address}
                                onChange={(e) =>
                                  setProfileForm({ ...profileForm, address: e.target.value })
                                }
                              />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="city">City *</Label>
                                <Input
                                  id="city"
                                  placeholder="Dhaka"
                                  value={profileForm.city}
                                  onChange={(e) =>
                                    setProfileForm({ ...profileForm, city: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="state">State / Division</Label>
                                <Input
                                  id="state"
                                  placeholder="Dhaka Division"
                                  value={profileForm.state}
                                  onChange={(e) =>
                                    setProfileForm({ ...profileForm, state: e.target.value })
                                  }
                                />
                              </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="zip_code">ZIP / Postal Code</Label>
                                <Input
                                  id="zip_code"
                                  placeholder="1205"
                                  value={profileForm.zip_code}
                                  onChange={(e) =>
                                    setProfileForm({ ...profileForm, zip_code: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="country">Country *</Label>
                                <Input
                                  id="country"
                                  placeholder="Bangladesh"
                                  value={profileForm.country}
                                  onChange={(e) =>
                                    setProfileForm({ ...profileForm, country: e.target.value })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button
                          className="w-full sm:w-auto"
                          size="lg"
                          onClick={handleSaveProfile}
                          disabled={isSavingProfile}
                        >
                          {isSavingProfile ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              Save & Continue
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Mini Order Summary */}
                  <div className="lg:col-span-1">
                    <OrderSummaryCard items={items} subtotal={subtotal} total={total} shipping={shipping} appliedCoupon={appliedCoupon} discountAmount={discountAmount} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 2: REVIEW ORDER ─── */}
            {step === "review" && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Shipping Address */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <MapPin className="h-4 w-4 text-primary" />
                          Delivery Address
                        </CardTitle>
                        <Link
                          to="/account"
                          className="text-xs text-primary hover:underline"
                        >
                          Edit
                        </Link>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-sm">
                          <p className="font-medium">{u.full_name}</p>
                          <p className="text-muted-foreground">{u.address}</p>
                          <p className="text-muted-foreground">
                            {[u.city, u.state, u.zip_code].filter(Boolean).join(", ")}
                          </p>
                          <p className="text-muted-foreground">{u.country}</p>
                          <p className="text-muted-foreground flex items-center gap-1 mt-2">
                            <Phone className="h-3.5 w-3.5" />
                            {u.phone}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Cart Items */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Package className="h-4 w-4 text-primary" />
                          Order Items ({items.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="divide-y divide-border">
                          {items.map((item) => (
                            <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-20 object-cover rounded-lg shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{item.name}</p>
                                <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground mt-1">
                                  {item.size && <span>Size: {item.size}</span>}
                                  {item.color && <span>Color: {item.color}</span>}
                                  <span>Qty: {item.quantity}</span>
                                </div>
                              </div>
                              <p className="font-semibold text-sm whitespace-nowrap">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Payment Method Selector */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <CreditCard className="h-4 w-4 text-primary" />
                          Payment Method
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-3 gap-3">
                          {/* bKash Payment Button */}
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("bkash")}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all relative ${
                              paymentMethod === "bkash"
                                ? "border-[#E2136E] bg-[#E2136E]/10 ring-2 ring-[#E2136E]/30"
                                : "border-border hover:border-[#E2136E]/50 bg-card"
                            }`}
                          >
                            <div className="w-9 h-9 rounded-lg bg-[#E2136E] text-white flex items-center justify-center font-bold text-xs tracking-tighter">
                              bKash
                            </div>
                            <span className="text-xs font-semibold">bKash Mobile</span>
                            {paymentMethod === "bkash" && (
                              <Check className="h-4 w-4 text-[#E2136E] absolute top-2 right-2" />
                            )}
                          </button>

                          {/* Card Payment Button */}
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("card")}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all relative ${
                              paymentMethod === "card"
                                ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                                : "border-border hover:border-primary/50 bg-card"
                            }`}
                          >
                            <div className="w-9 h-9 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                              <CreditCard className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-semibold">Credit/Debit Card</span>
                            {paymentMethod === "card" && (
                              <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
                            )}
                          </button>

                          {/* Cash on Delivery Button */}
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("cod")}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all relative ${
                              paymentMethod === "cod"
                                ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                                : "border-border hover:border-primary/50 bg-card"
                            }`}
                          >
                            <div className="w-9 h-9 rounded-lg bg-secondary text-foreground flex items-center justify-center">
                              <Truck className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-semibold">Cash on Delivery</span>
                            {paymentMethod === "cod" && (
                              <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
                            )}
                          </button>
                        </div>

                        {/* bKash Payment Form */}
                        {paymentMethod === "bkash" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-5 rounded-xl border border-[#E2136E]/30 bg-gradient-to-br from-[#E2136E]/10 via-card to-[#E2136E]/5 space-y-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 bg-[#E2136E] text-white text-xs font-bold rounded">
                                  bKash Payment Gateway
                                </span>
                                <span className="text-xs text-muted-foreground">Instant Payment</span>
                              </div>
                              <span className="text-sm font-bold text-[#E2136E]">
                                ${(total + shipping).toFixed(2)}
                              </span>
                            </div>

                            <div className="p-3 rounded-lg bg-background/80 border border-[#E2136E]/20 text-xs space-y-1">
                              <p className="font-semibold text-foreground">Merchant / Store bKash Number:</p>
                              <p className="font-mono text-sm font-bold text-[#E2136E]">{storeBkashNumber}</p>
                              <p className="text-muted-foreground text-[11px]">
                                Automatic payment request will process instantly from your account.
                              </p>
                            </div>

                            <div className="space-y-3">
                              <div className="space-y-1.5">
                                <Label htmlFor="bkash_number" className="text-xs font-medium">
                                  Your bKash Account Number *
                                </Label>
                                <Input
                                  id="bkash_number"
                                  placeholder="e.g. 017XXXXXXXX"
                                  value={bkashNumber}
                                  onChange={(e) => setBkashNumber(e.target.value)}
                                  className="bg-background border-[#E2136E]/30 focus:border-[#E2136E]"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <Label htmlFor="bkash_pin" className="text-xs font-medium">
                                  bKash PIN / Verification *
                                </Label>
                                <Input
                                  id="bkash_pin"
                                  type="password"
                                  maxLength={5}
                                  placeholder="Enter 5-digit PIN"
                                  value={bkashPin}
                                  onChange={(e) => setBkashPin(e.target.value)}
                                  className="bg-background border-[#E2136E]/30 focus:border-[#E2136E]"
                                />
                              </div>

                              <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                                <Shield className="h-3 w-3 text-[#E2136E]" />
                                Your bKash PIN is securely processed with 256-bit SSL encryption.
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {/* Card Payment Form */}
                        {paymentMethod === "card" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-5 rounded-xl border border-primary/30 bg-primary/5 space-y-4"
                          >
                            <div className="space-y-3">
                              <div className="space-y-1.5">
                                <Label className="text-xs font-medium">Card Number *</Label>
                                <Input
                                  placeholder="4532 •••• •••• 8921"
                                  value={cardForm.cardNumber}
                                  onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs font-medium">Expiry *</Label>
                                  <Input
                                    placeholder="MM/YY"
                                    value={cardForm.expiry}
                                    onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs font-medium">CVC *</Label>
                                  <Input
                                    placeholder="123"
                                    type="password"
                                    maxLength={4}
                                    value={cardForm.cvc}
                                    onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value })}
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* COD Info */}
                        {paymentMethod === "cod" && (
                          <div className="p-4 rounded-xl border border-border bg-muted/40">
                            <p className="text-xs text-muted-foreground">
                              Pay in cash when your package is delivered to your shipping address.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Order Notes */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Order Notes (Optional)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <textarea
                          className="w-full bg-input border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                          rows={3}
                          placeholder="Any special instructions for delivery..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Order Summary */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-28 space-y-4">
                      <OrderSummaryCard items={items} subtotal={subtotal} total={total} shipping={shipping} appliedCoupon={appliedCoupon} discountAmount={discountAmount} />

                      <Button
                        className={`w-full font-bold shadow-lg ${paymentMethod === "bkash" ? "bg-[#E2136E] hover:bg-[#c90f60] text-white" : ""}`}
                        size="lg"
                        onClick={() => {
                          if (paymentMethod === "bkash") {
                            startBkashPaymentFlow();
                          } else {
                            handlePlaceOrder();
                          }
                        }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {isBkashVerifying ? "Verifying bKash PIN..." : "Placing Order..."}
                          </>
                        ) : (
                          <>
                            {paymentMethod === "bkash" ? `Pay with bKash — $${(total + shipping).toFixed(2)}` : `Place Order — $${(total + shipping).toFixed(2)}`}
                          </>
                        )}
                      </Button>

                      {/* Trust badges */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Shield className="h-4 w-4 text-primary shrink-0" />
                          <span>Secure Checkout</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Truck className="h-4 w-4 text-primary shrink-0" />
                          <span>Free Shipping</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-4 w-4 text-primary shrink-0" />
                          <span>3-5 Day Delivery</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Package className="h-4 w-4 text-primary shrink-0" />
                          <span>Easy Returns</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 3: ORDER CONFIRMATION ─── */}
            {step === "confirmation" && orderResult && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
              >
                <Card className="overflow-hidden">
                  {/* Success header */}
                  <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-16 h-16 rounded-full bg-primary mx-auto flex items-center justify-center mb-4"
                    >
                      <Check className="h-8 w-8 text-primary-foreground" />
                    </motion.div>
                    <h2 className="text-2xl font-display font-bold text-foreground">
                      Order Confirmed!
                    </h2>
                    <p className="text-muted-foreground mt-2">
                      Thank you for shopping with ZIVARA
                    </p>
                  </div>

                  <CardContent className="p-6 sm:p-8 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Order Number</p>
                        <p className="font-display font-bold text-lg text-primary">
                          {orderResult.order_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                        <p className="font-display font-bold text-lg">
                          ${orderResult.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      {orderResult.payment_method === "bkash" ? (
                        <div className="flex items-start gap-3 p-3 rounded-lg border border-[#E2136E]/30 bg-[#E2136E]/10">
                          <div className="w-8 h-8 rounded bg-[#E2136E] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            bKash
                          </div>
                          <div>
                            <p className="font-semibold text-[#E2136E] flex items-center gap-2">
                              Paid via bKash (Successful)
                              <span className="text-[10px] bg-[#E2136E] text-white px-2 py-0.5 rounded-full font-bold">PAID</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Account: <span className="font-medium text-foreground">{orderResult.payment_details?.bkash_number || "bKash Wallet"}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              TrxID: <span className="font-mono text-primary font-bold">{orderResult.payment_details?.transaction_id || "TRX-VERIFIED"}</span>
                            </p>
                          </div>
                        </div>
                      ) : orderResult.payment_method === "card" ? (
                        <div className="flex items-start gap-3 p-3 rounded-lg border border-primary/30 bg-primary/10">
                          <CreditCard className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-primary">Paid via Credit/Debit Card (PAID)</p>
                            <p className="text-xs text-muted-foreground">TrxID: {orderResult.payment_details?.transaction_id}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Cash on Delivery</p>
                            <p className="text-muted-foreground">
                              Please keep ${orderResult.total.toFixed(2)} ready when your order arrives.
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Delivering to</p>
                          <p className="text-muted-foreground">
                            {u.address}, {u.city}
                            {u.state ? `, ${u.state}` : ""}
                            {u.zip_code ? ` ${u.zip_code}` : ""}, {u.country}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Estimated Delivery</p>
                          <p className="text-muted-foreground">3-5 business days</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate("/account")}
                      >
                        View My Orders
                      </Button>
                      <Button className="flex-1" onClick={() => navigate("/products")}>
                        Continue Shopping
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── OFFICIAL BKASH PAYMENT GATEWAY MODAL ─── */}
      <Dialog open={isBkashModalOpen} onOpenChange={setIsBkashModalOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-[#E2136E]">
          {/* bKash Header */}
          <div className="bg-[#E2136E] text-white p-5 text-center relative">
            <div className="w-12 h-12 rounded-xl bg-white text-[#E2136E] mx-auto flex items-center justify-center font-black text-xl shadow-md mb-2">
              bKash
            </div>
            <DialogTitle className="text-xl font-bold text-white tracking-wide">
              bKash Payment Gateway
            </DialogTitle>
            <p className="text-xs text-white/80 mt-1">
              Merchant: <span className="font-mono font-bold text-white">{storeBkashNumber}</span>
            </p>
            <div className="mt-3 py-1.5 px-4 bg-white/15 rounded-full inline-block text-xs font-semibold text-white">
              Amount to Pay: <span className="font-bold text-yellow-300">${(total + shipping).toFixed(2)}</span>
            </div>
          </div>

          {/* SMS Notification Banner */}
          {smsBanner && (
            <div className="bg-amber-100 border-y border-amber-300 text-amber-900 px-4 py-2 text-xs flex items-center gap-2">
              <span className="shrink-0 text-base">📲</span>
              <p className="font-medium leading-tight">{smsBanner}</p>
            </div>
          )}

          {/* Modal Body */}
          <div className="bg-card text-foreground p-6 space-y-5">
            {bkashModalStep === "otp" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="text-center space-y-1">
                  <p className="text-sm font-semibold">Enter bKash Verification Code (OTP)</p>
                  <p className="text-xs text-muted-foreground">
                    A 6-digit code has been sent via SMS to <span className="font-bold text-foreground">{bkashNumber}</span>.
                  </p>
                </div>

                <div className="space-y-2">
                  <Input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP code"
                    value={userOtp}
                    onChange={(e) => setUserOtp(e.target.value)}
                    className="text-center text-lg font-mono tracking-widest bg-background border-[#E2136E]/40 focus:border-[#E2136E]"
                  />
                  <p className="text-[11px] text-center text-muted-foreground">
                    Code pre-filled from simulated SMS for easy testing!
                  </p>
                </div>

                <Button
                  className="w-full bg-[#E2136E] hover:bg-[#c90f60] text-white font-bold text-sm py-2.5"
                  onClick={verifyBkashOtp}
                >
                  Verify Code
                </Button>
              </motion.div>
            )}

            {bkashModalStep === "pin" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="text-center space-y-1">
                  <p className="text-sm font-semibold">Enter bKash Account PIN</p>
                  <p className="text-xs text-muted-foreground">
                    Enter 5-digit PIN of your bKash account <span className="font-bold text-foreground">{bkashNumber}</span> to authorize payment.
                  </p>
                </div>

                <div className="space-y-2">
                  <Input
                    type="password"
                    maxLength={5}
                    placeholder="Enter 5-digit PIN"
                    value={bkashPin}
                    onChange={(e) => setBkashPin(e.target.value)}
                    className="text-center text-lg font-mono tracking-widest bg-background border-[#E2136E]/40 focus:border-[#E2136E]"
                  />
                </div>

                <Button
                  className="w-full bg-[#E2136E] hover:bg-[#c90f60] text-white font-bold text-sm py-2.5"
                  onClick={() => handlePlaceOrder("bkash")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    "Confirm bKash Payment"
                  )}
                </Button>
              </motion.div>
            )}

            {bkashModalStep === "processing" && (
              <div className="py-8 text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="w-16 h-16 border-4 border-[#E2136E]/30 rounded-full" />
                  <div className="absolute inset-0 w-16 h-16 border-4 border-[#E2136E] border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-[#E2136E]">
                    bKash
                  </div>
                </div>
                <p className="text-sm font-semibold">Authorizing bKash Payment...</p>
                <p className="text-xs text-muted-foreground">Please do not close or refresh this window.</p>
              </div>
            )}

            <p className="text-[11px] text-center text-muted-foreground pt-2 border-t border-border flex items-center justify-center gap-1">
              <Shield className="h-3 w-3 text-[#E2136E]" />
              Secured by bKash Authorized Payment Gateway Protocol
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}

/* ─── Order Summary Sidebar Card ─── */
function OrderSummaryCard({
  items,
  subtotal,
  total,
  shipping,
  appliedCoupon,
  discountAmount,
}: {
  items: { name: string; quantity: number; price: number; image: string }[];
  subtotal: number;
  total: number;
  shipping: number;
  appliedCoupon: any;
  discountAmount: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items preview */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-12 object-cover rounded"
                />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <p className="text-sm truncate flex-1">{item.name}</p>
              <p className="text-sm font-medium whitespace-nowrap">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          {appliedCoupon && (
            <div className="flex justify-between text-sm text-emerald-500 font-medium">
              <span>Discount ({appliedCoupon.code})</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
            <span>Total</span>
            <span>${(total + shipping).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
