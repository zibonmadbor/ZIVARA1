// ============================================================
// ACCOUNT PAGE - Frontend Only (Mock Data)
// ============================================================
// TODO: Replace mock data with real API calls:
//   GET  /api/users/me          -> fetch logged-in user profile
//   PUT  /api/users/me          -> update profile { full_name, phone }
//   GET  /api/orders?userId=... -> fetch user's order history
//
// MongoDB Orders Model (reference):
//   { _id, order_number, customer_id, status, items[], total_amount, created_at }
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Package, Settings, LogOut, Mail, Phone, Edit2 } from "lucide-react";
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

// -------------------------------------------------------
// TODO: Replace with: GET /api/orders?userId=<id>
// -------------------------------------------------------
const MOCK_ORDERS = [
  { id: "1", order_number: "ZIV-001", status: "delivered", total_amount: 299, created_at: "2024-01-15" },
  { id: "2", order_number: "ZIV-002", status: "shipped", total_amount: 149, created_at: "2024-02-10" },
  { id: "3", order_number: "ZIV-003", status: "processing", total_amount: 499, created_at: "2024-03-01" },
];

export default function Account() {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    phone: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSaveProfile = async () => {
    setIsSaving(true);

    // TODO: Replace with:
    //   const res = await fetch('/api/users/me', {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    //     body: JSON.stringify(formData)
    //   });
    //   if (!res.ok) { toast error; return; }

    await new Promise((r) => setTimeout(r, 500)); // simulate network
    setIsEditing(false);
    toast({ title: "Profile updated successfully" });
    setIsSaving(false);
  };

  const handleSignOut = () => {
    // TODO: Call POST /api/auth/logout and clear token
    signOut();
    navigate("/");
    toast({ title: "Signed out successfully" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-500/20 text-green-400";
      case "shipped": return "bg-blue-500/20 text-blue-400";
      case "processing": return "bg-yellow-500/20 text-yellow-400";
      case "cancelled": return "bg-red-500/20 text-red-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container-premium max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-6 mb-10">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">
                  {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
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

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Manage your account details</CardDescription>
                    </div>
                    {!isEditing && (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
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
                          <Input id="phone" value={formData.phone}
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
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <span>{user.full_name || "Not set"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <span>{formData.phone || "Not set"}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              {/* TODO: Fetch from GET /api/orders?userId=<id> */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View your past orders and their status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {MOCK_ORDERS.map((order) => (
                        <div key={order.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border">
                          <div>
                            <p className="font-medium">{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${order.total_amount.toFixed(2)}</p>
                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
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
