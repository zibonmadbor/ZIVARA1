import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatsCard } from "@/components/admin/StatsCard";
import { SalesChart } from "@/components/admin/charts/SalesChart";
import { RevenueChart } from "@/components/admin/charts/RevenueChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingCart, Users, Package, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered": return "bg-green-500/20 text-green-400";
    case "shipped": return "bg-blue-500/20 text-blue-400";
    case "processing": return "bg-yellow-500/20 text-yellow-400";
    case "confirmed": return "bg-emerald-500/20 text-emerald-400";
    case "pending": return "bg-orange-500/20 text-orange-400";
    case "cancelled": case "refunded": return "bg-red-500/20 text-red-400";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setErrorMsg(null);
        const token = localStorage.getItem("zivara_token");
        const res = await fetch("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        } else {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to fetch dashboard");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Network error");
        toast({ title: "Failed to load dashboard data", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, [toast]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (errorMsg) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
          <p className="text-destructive font-medium text-lg">Error: {errorMsg}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </AdminLayout>
    );
  }

  if (!dashboardData) return null;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Revenue" value={`$${(dashboardData.totalRevenue || 0).toLocaleString()}`} change="Real-time" changeType="neutral" icon={DollarSign} description="from all orders" />
          <StatsCard title="Total Orders" value={dashboardData.totalOrders || 0} change="Real-time" changeType="neutral" icon={ShoppingCart} description="lifetime orders" />
          <StatsCard title="Total Users" value={dashboardData.totalCustomers || 0} change="Real-time" changeType="neutral" icon={Users} description="registered customers" />
          <StatsCard title="Total Products" value={dashboardData.totalProducts || 0} change="Real-time" changeType="neutral" icon={Package} description="in catalog" />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SalesChart data={dashboardData.salesData} />
          <RevenueChart data={dashboardData.revenueData} />
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Recent Orders</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardData.recentOrders?.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No recent orders found.</p>
            ) : (
              <div className="space-y-4">
                {dashboardData.recentOrders?.map((order: any) => (
                  <div key={order._id} className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_name || 'Guest'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold">${order.total?.toFixed(2)}</p>
                      <Badge className={getStatusColor(order.order_status)}>{order.order_status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
