import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Truck, Package, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

interface Order {
  _id: string;
  order_number: string;
  customer: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_status: OrderStatus;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  shipping: number;
  total: number;
  shipping_address: {
    address: string;
    city: string;
    state?: string;
    zip_code?: string;
    country: string;
  };
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
}

const statusOptions: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("zivara_token");
      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      } else {
        throw new Error("Failed to fetch orders");
      }
    } catch (err) {
      toast({ title: "Error loading orders", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const token = localStorage.getItem("zivara_token");
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ order_status: newStatus })
      });
      if (!res.ok) throw new Error("Update failed");
      
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, order_status: newStatus } : o)));
      toast({ title: `Order status updated to ${newStatus}` });
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, order_status: newStatus } : null);
      }
    } catch (err) {
      toast({ title: "Failed to update order status", variant: "destructive" });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      case "shipped": return <Truck className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

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

  const columns = [
    {
      key: "order_number", header: "Order",
      render: (order: Order) => (
        <div>
          <p className="font-medium">{order.order_number}</p>
          <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      key: "customer_name", header: "Customer",
      render: (order: Order) => (
        <div>
          <p className="font-medium">{order.customer_name || "N/A"}</p>
          <p className="text-xs text-muted-foreground">{order.shipping_address?.city}</p>
        </div>
      ),
    },
    {
      key: "total", header: "Amount",
      render: (order: Order) => <p className="font-semibold">${Number(order.total).toFixed(2)}</p>,
    },
    {
      key: "order_status", header: "Status",
      render: (order: Order) => (
        <Select value={order.order_status} onValueChange={(value) => updateStatus(order._id, value as OrderStatus)}>
          <SelectTrigger className="w-[140px]">
            <Badge className={getStatusColor(order.order_status)}>
              {getStatusIcon(order.order_status)}
              <span className="ml-1 capitalize">{order.order_status}</span>
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
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable columns={columns} data={orders} isLoading={false} searchPlaceholder="Search orders..." />
        )}

        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder?.order_number}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Select value={selectedOrder.order_status} onValueChange={(value) => updateStatus(selectedOrder._id, value as OrderStatus)}>
                      <SelectTrigger className="w-[160px] mt-1">
                        <Badge className={getStatusColor(selectedOrder.order_status)}>
                          {getStatusIcon(selectedOrder.order_status)}
                          <span className="ml-1 capitalize">{selectedOrder.order_status}</span>
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}><span className="capitalize">{status}</span></SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium mt-1">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-2">Payment</p>
                    <p className="font-medium capitalize">{selectedOrder.payment_method} - {selectedOrder.payment_status}</p>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 border-t border-border pt-4">
                  <div>
                    <h4 className="font-medium mb-2">Customer Info</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.customer_name}<br />
                      {selectedOrder.customer_email}<br />
                      {selectedOrder.customer_phone}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.shipping_address?.address}<br />
                      {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} {selectedOrder.shipping_address?.zip_code}<br />
                      {selectedOrder.shipping_address?.country}
                    </p>
                  </div>
                </div>

                {selectedOrder.notes && (
                   <div className="border-t border-border pt-4">
                     <h4 className="font-medium mb-1">Order Notes</h4>
                     <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border">
                       {selectedOrder.notes}
                     </p>
                   </div>
                )}

                <div className="border-t border-border pt-4">
                  <h4 className="font-medium mb-3">Order Items</h4>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {selectedOrder.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-12 h-16 object-cover rounded border border-border" />
                        ) : (
                          <div className="w-12 h-16 bg-muted rounded border border-border flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="space-y-2 text-sm max-w-[250px] ml-auto">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${Number(selectedOrder.subtotal).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>${Number(selectedOrder.shipping).toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-2"><span>Total</span><span>${Number(selectedOrder.total).toFixed(2)}</span></div>
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
