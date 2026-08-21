import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  FileText, 
  Printer, 
  Mail, 
  CheckCircle, 
  Loader2, 
  Plus, 
  Search, 
  DollarSign, 
  TrendingUp, 
  CreditCard,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InvoiceModal, InvoiceOrder } from "@/components/admin/InvoiceModal";
import { products as catalogProducts } from "@/data/products";

export default function AdminInvoices() {
  const [orders, setOrders] = useState<InvoiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceOrder | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const { toast } = useToast();

  // New manual invoice form state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(catalogProducts[0]?.id || "1");
  const [itemQty, setItemQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [discountAmount, setDiscountAmount] = useState(0);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("zivara_token");
      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const mapped: InvoiceOrder[] = (data.orders || []).map((o: any) => ({
          ...o,
          id: o._id || o.id,
          invoice_number: o.invoice_number || `INV-${o.order_number}`
        }));
        setOrders(mapped);
      }
    } catch (err) {
      console.error("Error fetching orders for invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSendEmail = async (order: InvoiceOrder) => {
    try {
      setSendingEmailId(order.id);
      const token = localStorage.getItem("zivara_token");
      const orderId = order._id || order.id;

      const res = await fetch(`/api/orders/${orderId}/send-invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send email");

      toast({
        title: "Invoice Email Sent! ✉️✨",
        description: `Official invoice was emailed directly to ${order.customer_email}`
      });

      fetchOrders();
    } catch (err: any) {
      toast({
        title: "Failed to dispatch email",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setSendingEmailId(null);
    }
  };

  const handleCreateManualInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = catalogProducts.find(p => p.id === selectedProductId);
    if (!product) return;

    const subtotal = product.price * itemQty;
    const total = Math.max(0, subtotal - Number(discountAmount));

    const newOrder: InvoiceOrder = {
      id: `manual-${Date.now()}`,
      order_number: `ZIV-${Math.floor(1000 + Math.random() * 9000)}`,
      invoice_number: `INV-MANUAL-${Date.now().toString().substring(6)}`,
      customer_name: customerName || "In-Store Client",
      customer_email: customerEmail || "client@zivara.fashion",
      customer_phone: customerPhone || "+880 1700-000000",
      order_status: "confirmed",
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      subtotal: subtotal,
      discount: Number(discountAmount),
      shipping: 0,
      total: total,
      shipping_address: {
        address: customerAddress || "Dhaka Store Pickup",
        city: "Dhaka",
        country: "Bangladesh"
      },
      createdAt: new Date().toISOString(),
      items: [
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: itemQty,
          image: product.image,
          color: product.colors?.[0],
          size: product.sizes?.[0]
        }
      ]
    };

    setOrders([newOrder, ...orders]);
    setIsCreateOpen(false);
    setSelectedInvoice(newOrder);

    toast({
      title: "Invoice Generated! 📄",
      description: `Manual invoice #${newOrder.invoice_number} created for $${total.toFixed(2)}.`
    });
  };

  // Metrics
  const totalInvoiced = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const paidInvoices = orders.filter(o => o.payment_status === "paid");
  const paidTotal = paidInvoices.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const pendingInvoices = orders.filter(o => o.payment_status !== "paid");

  const filteredOrders = orders.filter(o => {
    const q = searchQuery.toLowerCase();
    return (
      o.invoice_number?.toLowerCase().includes(q) ||
      o.order_number?.toLowerCase().includes(q) ||
      o.customer_name?.toLowerCase().includes(q) ||
      o.customer_email?.toLowerCase().includes(q)
    );
  });

  const columns = [
    {
      key: "invoice_number",
      header: "Invoice #",
      render: (order: InvoiceOrder) => (
        <div>
          <div className="flex items-center gap-1.5 font-bold text-foreground font-mono">
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span>{order.invoice_number || `INV-${order.order_number}`}</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Order #{order.order_number}
          </p>
        </div>
      ),
    },
    {
      key: "customer_name",
      header: "Billed Customer",
      render: (order: InvoiceOrder) => (
        <div>
          <p className="font-semibold text-foreground">{order.customer_name}</p>
          <p className="text-xs text-muted-foreground">{order.customer_email}</p>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      render: (order: InvoiceOrder) => (
        <span className="text-xs text-muted-foreground">
          {new Date(order.createdAt || Date.now()).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "total",
      header: "Total Bill",
      render: (order: InvoiceOrder) => (
        <div>
          <p className="font-bold text-foreground">${Number(order.total || 0).toFixed(2)}</p>
          <p className="text-[10px] text-muted-foreground">
            ৳{(Number(order.total || 0) * 120).toLocaleString()}
          </p>
        </div>
      ),
    },
    {
      key: "payment_status",
      header: "Payment",
      render: (order: InvoiceOrder) => (
        <Badge
          className={`text-[10px] font-bold uppercase ${
            order.payment_status === "paid"
              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
          }`}
        >
          {order.payment_status === "paid" ? "PAID" : "UNPAID"} ({order.payment_method?.toUpperCase() || "COD"})
        </Badge>
      ),
    },
    {
      key: "invoice_sent_at",
      header: "Email Status",
      render: (order: InvoiceOrder) => (
        order.invoice_sent_at ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500">
            <CheckCircle className="w-3 h-3" /> Sent
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> Ready
          </span>
        )
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (order: InvoiceOrder) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedInvoice(order)}
            className="h-8 gap-1 text-xs px-2.5 bg-primary/10 hover:bg-primary/20 text-primary border-primary/30"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            disabled={sendingEmailId === order.id}
            onClick={() => handleSendEmail(order)}
            className="h-8 gap-1 text-xs px-2 hover:bg-primary/10 text-muted-foreground hover:text-primary"
            title="Email Invoice to Customer"
          >
            {sendingEmailId === order.id ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            ) : (
              <Mail className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        
        {/* Header with Title & Quick Create */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-2.5">
              <span>Customer Invoices</span>
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                {orders.length} Invoices
              </Badge>
            </h1>
            <p className="text-muted-foreground text-sm">
              Generate, print, and automatically email official tax invoices with itemized billing
            </p>
          </div>

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Create Custom Invoice
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Total Invoiced</p>
              <p className="text-2xl font-bold text-foreground mt-1">${totalInvoiced.toFixed(2)}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{orders.length} total billed orders</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-500 uppercase">Paid & Cleared</p>
              <p className="text-2xl font-bold text-emerald-500 mt-1">${paidTotal.toFixed(2)}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{paidInvoices.length} paid invoices</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-500 uppercase">Pending / COD Invoices</p>
              <p className="text-2xl font-bold text-amber-500 mt-1">
                ${(totalInvoiced - paidTotal).toFixed(2)}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{pendingInvoices.length} pending payment</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-card rounded-xl border border-border">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredOrders}
            isLoading={false}
            searchPlaceholder="Search by invoice #, order #, or customer name..."
            onSearch={setSearchQuery}
          />
        )}

        {/* Modal: View / Print / Send Invoice */}
        <InvoiceModal
          order={selectedInvoice}
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onInvoiceSent={fetchOrders}
        />

        {/* Modal: Create Custom / Manual Invoice */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-xl bg-card border border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Create In-Store / Custom Invoice
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateManualInvoice} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="cname">Customer Name</Label>
                  <Input
                    id="cname"
                    placeholder="e.g. Tanvir Ahmed"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cemail">Customer Email (For Auto Mail)</Label>
                  <Input
                    id="cemail"
                    type="email"
                    placeholder="client@gmail.com"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="cphone">Customer Phone</Label>
                  <Input
                    id="cphone"
                    placeholder="+880 1700-000000"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="caddr">Address / Branch</Label>
                  <Input
                    id="caddr"
                    placeholder="Banani Showroom, Dhaka"
                    value={customerAddress}
                    onChange={e => setCustomerAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-border">
                <Label htmlFor="cprod">Select Product from Store</Label>
                <select
                  id="cprod"
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="w-full p-2 bg-muted/60 border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {catalogProducts.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.category.toUpperCase()}] {p.name} - ${p.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="cqty">Quantity</Label>
                  <Input
                    id="cqty"
                    type="number"
                    min="1"
                    value={itemQty}
                    onChange={e => setItemQty(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cdisc">Discount ($)</Label>
                  <Input
                    id="cdisc"
                    type="number"
                    min="0"
                    value={discountAmount}
                    onChange={e => setDiscountAmount(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cpay">Payment Method</Label>
                  <select
                    id="cpay"
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full p-2 bg-muted/60 border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="card">Credit Card</option>
                    <option value="cod">Cash / COD</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg flex justify-between items-center text-sm font-semibold">
                <span>Calculated Total Bill:</span>
                <span className="text-base text-primary font-bold">
                  ${Math.max(0, ((catalogProducts.find(p => p.id === selectedProductId)?.price || 0) * itemQty) - discountAmount).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground font-semibold">
                  Generate & View Invoice
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </AdminLayout>
  );
}
