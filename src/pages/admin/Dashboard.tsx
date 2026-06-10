
// ============================================================
// ADMIN DASHBOARD PAGE - Frontend Only (Mock Data)
// ============================================================
// TODO: Replace mock stats with real API calls:
//   GET /api/admin/stats  -> { totalRevenue, totalOrders, totalUsers, totalProducts }
//   GET /api/admin/orders?limit=5&sort=recent -> recent orders
//   GET /api/admin/analytics/sales?period=week -> sales chart data
//   GET /api/admin/analytics/revenue?period=6months -> revenue chart data
//
// Express route example:
//   router.get('/admin/stats', protect, isAdmin, async (req, res) => {
//     const [orders, users, products] = await Promise.all([
//       Order.aggregate([{ $group: { _id: null, total: { $sum: '$total_amount' } } }]),
//       User.countDocuments(),
//       Product.countDocuments()
//     ]);
//     res.json({ totalRevenue: orders[0]?.total, totalOrders: ..., totalUsers: users, totalProducts: products });
//   });
// ============================================================

import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatsCard } from "@/components/admin/StatsCard";
import { SalesChart } from "@/components/admin/charts/SalesChart";
import { RevenueChart } from "@/components/admin/charts/RevenueChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingCart, Users, Package, Clock } from "lucide-react";
import { products } from "@/data/products";

// TODO: Fetch from GET /api/admin/analytics/sales
const mockSalesData = [
  { date: "Mon", sales: 4500, orders: 12 },
  { date: "Tue", sales: 5200, orders: 18 },
  { date: "Wed", sales: 4800, orders: 15 },
  { date: "Thu", sales: 6100, orders: 22 },
  { date: "Fri", sales: 7200, orders: 28 },
  { date: "Sat", sales: 8500, orders: 35 },
  { date: "Sun", sales: 6800, orders: 24 },
];

// TODO: Fetch from GET /api/admin/analytics/revenue
const mockRevenueData = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 72000 },
  { month: "Jun", revenue: 85000 },
];

// TODO: Fetch from GET /api/admin/orders?limit=5&sort=recent
const mockRecentOrders = [
  { id: "ZIV-001", customer: "John Doe", amount: 299, status: "delivered" },
  { id: "ZIV-002", customer: "Jane Smith", amount: 549, status: "processing" },
  { id: "ZIV-003", customer: "Bob Wilson", amount: 199, status: "shipped" },
  { id: "ZIV-004", customer: "Alice Brown", amount: 899, status: "pending" },
  { id: "ZIV-005", customer: "Charlie Davis", amount: 349, status: "confirmed" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered": return "bg-primary/20 text-primary";
    case "shipped": return "bg-blue-500/20 text-blue-400";
    case "processing": return "bg-yellow-500/20 text-yellow-400";
    case "confirmed": return "bg-cyan-500/20 text-cyan-400";
    case "pending": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function AdminDashboard() {
  // TODO: Replace with data from GET /api/admin/stats
  const stats = {
    totalRevenue: 363000,
    totalOrders: 134,
    totalUsers: 89,
    totalProducts: products.length,
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} change="+12.5%" changeType="positive" icon={DollarSign} description="vs last month" />
          <StatsCard title="Total Orders" value={stats.totalOrders} change="+8.2%" changeType="positive" icon={ShoppingCart} description="vs last month" />
          <StatsCard title="Total Users" value={stats.totalUsers} change="+23.1%" changeType="positive" icon={Users} description="vs last month" />
          <StatsCard title="Total Products" value={stats.totalProducts} change="+5" changeType="positive" icon={Package} description="new this week" />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SalesChart data={mockSalesData} />
          <RevenueChart data={mockRevenueData} />
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Recent Orders</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold">${order.amount}</p>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
