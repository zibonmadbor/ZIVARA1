import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal, total, clearCart, appliedCoupon, setAppliedCoupon, discountAmount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplying(true);
    try {
      const res = await fetch(`/api/coupons/validate?code=${couponCode.trim()}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Invalid coupon code");
      }

      if (subtotal < data.coupon.min_order_amount) {
        throw new Error(`Minimum order amount for this coupon is $${data.coupon.min_order_amount}`);
      }

      setAppliedCoupon(data.coupon);
      setCouponCode("");
      toast({
        title: "Coupon Applied",
        description: `Coupon "${data.coupon.code}" has been applied successfully.`,
      });
    } catch (err: any) {
      toast({
        title: "Coupon failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast({ title: "Coupon removed" });
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }
    navigate("/checkout");
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container-premium max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-display font-bold mb-10">Shopping Cart</h1>

            {items.length > 0 ? (
              <div className="grid lg:grid-cols-3 gap-10">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-6 p-4 rounded-lg border border-border bg-card"
                    >
                      <Link to={`/product/${item.productId}`} className="shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-32 object-cover rounded-lg"
                        />
                      </Link>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <Link
                            to={`/product/${item.productId}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                          {item.size && (
                            <p className="text-sm text-muted-foreground">
                              Size: {item.size}
                            </p>
                          )}
                          {item.color && (
                            <p className="text-sm text-muted-foreground">
                              Color: {item.color}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-border rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-secondary transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-secondary transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="self-start p-2 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}

                  <Button variant="outline" onClick={clearCart} className="text-destructive">
                    Clear Cart
                  </Button>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="sticky top-28 p-6 rounded-lg border border-border bg-card">
                    <h2 className="text-xl font-display font-bold mb-6">Order Summary</h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      
                      {appliedCoupon && (
                        <div className="flex justify-between text-emerald-500 font-medium">
                          <span>Discount ({appliedCoupon.code})</span>
                          <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span>Calculated at checkout</span>
                      </div>
                      <div className="border-t border-border pt-4 flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Coupon */}
                    <div className="mb-6">
                      {appliedCoupon ? (
                        <div className="flex items-center justify-between p-3 border border-emerald-500/30 bg-emerald-500/10 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-emerald-500 flex items-center gap-2">
                              Coupon Applied
                            </p>
                            <p className="text-xs text-emerald-500/80">{appliedCoupon.code}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleRemoveCoupon}>
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          />
                          <Button variant="outline" onClick={handleApplyCoupon} disabled={isApplying}>
                            {isApplying ? "Applying..." : "Apply"}
                          </Button>
                        </div>
                      )}
                    </div>

                    <Button className="w-full" size="lg" onClick={handleCheckout}>
                      Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Taxes and shipping calculated at checkout
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                <h2 className="text-2xl font-display font-bold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <Button onClick={() => navigate("/products")}>
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
