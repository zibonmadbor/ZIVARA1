import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, Package, Settings, LogOut, Mail, Phone, Edit2,
  MapPin, Home, Building2, Globe, ShoppingBag, ArrowRight, Loader2
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Account() {
  const { user, signOut, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    phone: user?.phone || "",
  });

  const [addressData, setAddressData] = useState({
    address: (user as any)?.address || "",
    city: (user as any)?.city || "",
    state: (user as any)?.state || "",
    zip_code: (user as any)?.zip_code || "",
    country: (user as any)?.country || "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user) {
    navigate("/login");
    return null;
  }

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const token = localStorage.getItem("zivara_token");
        const res = await fetch("/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch {
        console.error("Failed to fetch orders");
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleEdit = () => {
    setFormData({
      full_name: user.full_name || "",
      phone: user.phone || "",
    });
    setIsEditing(true);
  };

  const handleEditAddress = () => {
    setAddressData({
      address: (user as any)?.address || "",
      city: (user as any)?.city || "",
      state: (user as any)?.state || "",
      zip_code: (user as any)?.zip_code || "",
      country: (user as any)?.country || "",
    });
    setIsEditingAddress(true);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const { error } = await updateProfile(formData.full_name, formData.phone);
    setIsSaving(false);
    if (error) {
      toast({ title: "Update Failed", description: error, variant: "destructive" });
      return;
    }
    setIsEditing(false);
    toast({ title: "Profile updated successfully" });
  };

  const handleSaveAddress = async () => {
    setIsSavingAddress(true);
    const token = localStorage.getItem("zivara_token");
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });
      if (!res.ok) throw new Error("Failed to save address");
      setIsEditingAddress(false);
      toast({ title: "Address saved successfully" });
    } catch {
      toast({ title: "Failed to save address", variant: "destructive" });
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate("/");
    toast({ title: "Signed out successfully" });
  };

  const u = user as any;
  const hasAddress = u.address || u.city || u.state || u.country;

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container-premium max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Header */}
            <div className="flex items-center gap-6 mb-10">
              <Avatar className="h-20 w-20 ring-2 ring-primary/30">
                <AvatarFallback className="text-2xl bg-primary/10 text-primary font-display">
                  {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-display font-bold">{user.full_name || "Welcome"}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Profile
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <Package className="h-4 w-4" /> Orders
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" /> Settings
                </TabsTrigger>
              </TabsList>

              {/* ─── Profile Tab ─── */}
              <TabsContent value="profile" className="space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Manage your account details</CardDescription>
                    </div>
                    {!isEditing && (
                      <Button variant="outline" size="sm" onClick={handleEdit}>
                        <Edit2 className="h-4 w-4 mr-2" /> Edit
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="full_name">Full Name</Label>
                          <Input id="full_name" value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" placeholder="+1 (555) 000-0000" value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <div className="flex gap-3">
                          <Button onClick={handleSaveProfile} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Changes"}
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 py-2 border-b border-border/50">
                          <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                            <p className="text-sm font-medium">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 py-2 border-b border-border/50">
                          <User className="h-5 w-5 text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">Full Name</p>
                            <p className="text-sm font-medium">{user.full_name || <span className="text-muted-foreground italic">Not set</span>}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 py-2">
                          <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                            <p className="text-sm font-medium">{user.phone || <span className="text-muted-foreground italic">Not set</span>}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Address Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Delivery Address
                      </CardTitle>
                      <CardDescription>Your default shipping address</CardDescription>
                    </div>
                    {!isEditingAddress && (
                      <Button variant="outline" size="sm" onClick={handleEditAddress}>
                        <Edit2 className="h-4 w-4 mr-2" /> {hasAddress ? "Edit" : "Add"}
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {isEditingAddress ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="address">Street Address</Label>
                          <Input id="address" placeholder="123 Main Street, Apt 4B"
                            value={addressData.address}
                            onChange={(e) => setAddressData({ ...addressData, address: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" placeholder="New York"
                              value={addressData.city}
                              onChange={(e) => setAddressData({ ...addressData, city: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State / Province</Label>
                            <Input id="state" placeholder="NY"
                              value={addressData.state}
                              onChange={(e) => setAddressData({ ...addressData, state: e.target.value })} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="zip_code">ZIP / Postal Code</Label>
                            <Input id="zip_code" placeholder="10001"
                              value={addressData.zip_code}
                              onChange={(e) => setAddressData({ ...addressData, zip_code: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" placeholder="United States"
                              value={addressData.country}
                              onChange={(e) => setAddressData({ ...addressData, country: e.target.value })} />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button onClick={handleSaveAddress} disabled={isSavingAddress}>
                            {isSavingAddress ? "Saving..." : "Save Address"}
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditingAddress(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : hasAddress ? (
                      <div className="space-y-3">
                        {u.address && (
                          <div className="flex items-start gap-3">
                            <Home className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground mb-0.5">Street</p>
                              <p className="text-sm font-medium">{u.address}</p>
                            </div>
                          </div>
                        )}
                        {(u.city || u.state) && (
                          <div className="flex items-start gap-3">
                            <Building2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground mb-0.5">City / State</p>
                              <p className="text-sm font-medium">{[u.city, u.state, u.zip_code].filter(Boolean).join(", ")}</p>
                            </div>
                          </div>
                        )}
                        {u.country && (
                          <div className="flex items-start gap-3">
                            <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground mb-0.5">Country</p>
                              <p className="text-sm font-medium">{u.country}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                          <MapPin className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">No address saved</p>
                        <p className="text-xs text-muted-foreground">Add a delivery address for faster checkout</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ─── Orders Tab ─── */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View your past orders and their status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <OrdersList orders={orders} ordersLoading={ordersLoading} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ─── Settings Tab ─── */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <LogOut className="h-5 w-5 text-destructive" />
                        <div>
                          <p className="font-medium">Sign Out</p>
                          <p className="text-sm text-muted-foreground">Sign out of your account</p>
                        </div>
                      </div>
                      <Button variant="destructive" onClick={handleSignOut}>Sign Out</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ─── Orders List Component ─── */
function OrdersList({ orders, ordersLoading }: { orders: any[]; ordersLoading: boolean }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-500/20 text-green-400";
      case "shipped": return "bg-blue-500/20 text-blue-400";
      case "processing": return "bg-yellow-500/20 text-yellow-400";
      case "confirmed": return "bg-emerald-500/20 text-emerald-400";
      case "pending": return "bg-orange-500/20 text-orange-400";
      case "cancelled": return "bg-red-500/20 text-red-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (ordersLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-display font-semibold text-foreground mb-2">No orders yet</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-xs">
          Looks like you haven't placed any orders yet. Start shopping to see your orders here.
        </p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          Start Shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order: any) => (
        <div
          key={order._id}
          className="flex items-center justify-between p-4 rounded-lg border border-border"
        >
          <div>
            <p className="font-medium">{order.order_number}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">${order.total?.toFixed(2)}</p>
            <span
              className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(order.order_status)}`}
            >
              {order.order_status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
