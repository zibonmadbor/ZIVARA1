
// ============================================================
// ADMIN ORDERS PAGE - Frontend Only (Mock Data)
// ============================================================
// TODO: Replace mock data with real API calls:
//   GET  /api/admin/orders        -> list all orders
//   PUT  /api/admin/orders/:id    -> update order status { status }
//
// MongoDB Order Model (reference):
//   { _id, order_number, customer_id, status, items[], subtotal,
//     discount_amount, shipping_amount, tax_amount, total_amount,
//     shipping_name, shipping_address, created_at }
// ============================================================

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Truck, Package, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  status: OrderStatus;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  shipping_name: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_zip: string | null;
  shipping_country: string | null;
  shipping_phone: string | null;
  notes: string | null;
  created_at: string;
}

const statusOptions: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];

// TODO: Replace with data from GET /api/admin/orders
const MOCK_ORDERS: Order[] = [
  { id: "1", order_number: "ZIV-001", customer_id: "1", status: "delivered", subtotal: 270, discount_amount: 0, shipping_amount: 10, tax_amount: 19, total_amount: 299, shipping_name: "John Doe", shipping_address: "123 Main St", shipping_city: "New York", shipping_state: "NY", shipping_zip: "10001", shipping_country: "US", shipping_phone: "+1 555-0100", notes: null, created_at: "2024-01-15T10:00:00Z" },
  { id: "2", order_number: "ZIV-002", customer_id: "2", status: "shipped", subtotal: 520, discount_amount: 20, shipping_amount: 15, tax_amount: 34, total_amount: 549, shipping_name: "Jane Smith", shipping_address: "456 Oak Ave", shipping_city: "Los Angeles", shipping_state: "CA", shipping_zip: "90001", shipping_country: "US", shipping_phone: "+1 555-0200", notes: "Gift wrap please", created_at: "2024-02-10T09:00:00Z" },
  { id: "3", order_number: "ZIV-003", customer_id: "3", status: "processing", subtotal: 180, discount_amount: 0, shipping_amount: 0, tax_amount: 19, total_amount: 199, shipping_name: "Bob Wilson", shipping_address: "789 Pine Rd", shipping_city: "Chicago", shipping_state: "IL", shipping_zip: "60601", shipping_country: "US", shipping_phone: "+1 555-0300", notes: null, created_at: "2024-03-01T14:00:00Z" },
  { id: "4", order_number: "ZIV-004", customer_id: null, status: "pending", subtotal: 850, discount_amount: 50, shipping_amount: 20, tax_amount: 79, total_amount: 899, shipping_name: "Alice Brown", shipping_address: "321 Elm St", shipping_city: "Houston", shipping_state: "TX", shipping_zip: "77001", shipping_country: "US", shipping_phone: "+1 555-0400", notes: null, created_at: "2024-03-15T11:00:00Z" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    // TODO: PUT /api/admin/orders/:id  { status: newStatus }
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    toast({ title: `Order status updated to ${newStatus}` });
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      case "shipped": return <Truck className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "delivered": return "bg-primary/20 text-primary";
      case "shipped": return "bg-blue-500/20 text-blue-400";
      case "processing": return "bg-yellow-500/20 text-yellow-400";
      case "confirmed": return "bg-cyan-500/20 text-cyan-400";
      case "pending": return "bg-muted text-muted-foreground";
      case "cancelled": case "refunded": return "bg-destructive/20 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const columns = [
    {
      key: "order_number", header: "Order",
      render: (order: Order) => (
        <div>
          <p className="font-medium">{order.order_number}</p>
          <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      key: "shipping_name", header: "Customer",
      render: (order: Order) => (
        <div>
          <p className="font-medium">{order.shipping_name || "N/A"}</p>
          <p className="text-xs text-muted-foreground">{order.shipping_city}</p>
        </div>
      ),
    },
    {
      key: "total_amount", header: "Amount",
      render: (order: Order) => <p className="font-semibold">${Number(order.total_amount).toFixed(2)}</p>,
    },
    {
      key: "status", header: "Status",
      render: (order: Order) => (
        <Select value={order.status} onValueChange={(value) => updateStatus(order.id, value as OrderStatus)}>
          <SelectTrigger className="w-[140px]">
            <Badge className={getStatusColor(order.status)}>
              {getStatusIcon(order.status)}
              <span className="ml-1 capitalize">{order.status}</span>
            </Badge>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}><span className="capitalize">{status}</span></SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "actions", header: "Actions",
      render: (order: Order) => (
        <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>
        <DataTable columns={columns} data={orders} isLoading={false} searchPlaceholder="Search orders..." />
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder?.order_number}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.shipping_name}<br />
                    {selectedOrder.shipping_address}<br />
                    {selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_zip}<br />
                    {selectedOrder.shipping_country}<br />
                    {selectedOrder.shipping_phone}
                  </p>
                </div>
                <div className="border-t border-border pt-4">
                  <h4 className="font-medium mb-2">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${Number(selectedOrder.subtotal).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>-${Number(selectedOrder.discount_amount).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>${Number(selectedOrder.shipping_amount).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${Number(selectedOrder.tax_amount).toFixed(2)}</span></div>
                    <div className="flex justify-between font-semibold border-t border-border pt-2"><span>Total</span><span>${Number(selectedOrder.total_amount).toFixed(2)}</span></div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
