
// ============================================================
// ADMIN COUPONS PAGE - Frontend Only (Mock Data)
// ============================================================
// TODO: Replace mock data with real API calls:
//   GET    /api/admin/coupons      -> list all coupons
//   POST   /api/admin/coupons      -> create coupon
//   PUT    /api/admin/coupons/:id  -> update coupon
//   DELETE /api/admin/coupons/:id  -> delete coupon
// ============================================================

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Ticket, Percent, DollarSign, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CouponType = "percentage" | "fixed_amount" | "free_shipping";

interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  used_count: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
}

const couponTypeOptions: { value: CouponType; label: string; icon: React.ElementType }[] = [
  { value: "percentage", label: "Percentage Off", icon: Percent },
  { value: "fixed_amount", label: "Fixed Amount", icon: DollarSign },
  { value: "free_shipping", label: "Free Shipping", icon: Truck },
];

const MOCK_COUPONS: Coupon[] = [
  { id: "1", code: "SUMMER20", type: "percentage", discount_value: 20, min_order_amount: 100, max_uses: 500, used_count: 127, start_date: "2024-06-01", end_date: "2024-08-31", is_active: true, created_at: "2024-05-01T00:00:00Z" },
  { id: "2", code: "WELCOME50", type: "fixed_amount", discount_value: 50, min_order_amount: 200, max_uses: null, used_count: 43, start_date: null, end_date: null, is_active: true, created_at: "2024-01-01T00:00:00Z" },
  { id: "3", code: "FREESHIP", type: "free_shipping", discount_value: 0, min_order_amount: 50, max_uses: 200, used_count: 89, start_date: null, end_date: "2024-12-31", is_active: false, created_at: "2024-03-01T00:00:00Z" },
];

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({ code: "", type: "percentage" as CouponType, discount_value: "", min_order_amount: "0", max_uses: "", start_date: "", end_date: "", is_active: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const couponData: Coupon = {
      id: editingCoupon?.id || Date.now().toString(),
      code: formData.code.toUpperCase(), type: formData.type,
      discount_value: parseFloat(formData.discount_value) || 0,
      min_order_amount: parseFloat(formData.min_order_amount) || 0,
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
      used_count: editingCoupon?.used_count || 0,
      start_date: formData.start_date || null, end_date: formData.end_date || null,
      is_active: formData.is_active, created_at: editingCoupon?.created_at || new Date().toISOString(),
    };
    // TODO: PUT /api/admin/coupons/:id or POST /api/admin/coupons
    if (editingCoupon) {
      setCoupons((prev) => prev.map((c) => (c.id === editingCoupon.id ? couponData : c)));
      toast({ title: "Coupon updated successfully" });
    } else {
      setCoupons((prev) => [couponData, ...prev]);
      toast({ title: "Coupon created successfully" });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({ code: coupon.code, type: coupon.type, discount_value: coupon.discount_value.toString(), min_order_amount: coupon.min_order_amount.toString(), max_uses: coupon.max_uses?.toString() || "", start_date: coupon.start_date?.split("T")[0] || "", end_date: coupon.end_date?.split("T")[0] || "", is_active: coupon.is_active });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    // TODO: DELETE /api/admin/coupons/:id
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Coupon deleted successfully" });
  };

  const resetForm = () => {
    setEditingCoupon(null);
    setFormData({ code: "", type: "percentage", discount_value: "", min_order_amount: "0", max_uses: "", start_date: "", end_date: "", is_active: true });
  };

  const getTypeIcon = (type: CouponType) => {
    const typeOption = couponTypeOptions.find((t) => t.value === type);
    const Icon = typeOption?.icon || Ticket;
    return <Icon className="h-4 w-4" />;
  };

  const formatDiscount = (coupon: Coupon) => {
    switch (coupon.type) {
      case "percentage": return `${coupon.discount_value}%`;
      case "fixed_amount": return `$${coupon.discount_value}`;
      case "free_shipping": return "Free Shipping";
      default: return coupon.discount_value;
    }
  };

  const columns = [
    {
      key: "code", header: "Coupon",
      render: (coupon: Coupon) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">{getTypeIcon(coupon.type)}</div>
          <div>
            <p className="font-mono font-medium">{coupon.code}</p>
            <p className="text-xs text-muted-foreground capitalize">{coupon.type.replace("_", " ")}</p>
          </div>
        </div>
      ),
    },
    { key: "discount", header: "Discount", render: (coupon: Coupon) => <span className="font-semibold text-primary">{formatDiscount(coupon)}</span> },
    { key: "usage", header: "Usage", render: (coupon: Coupon) => <span className="text-muted-foreground">{coupon.used_count} / {coupon.max_uses || "∞"}</span> },
    { key: "validity", header: "Valid Until", render: (coupon: Coupon) => <span className="text-sm text-muted-foreground">{coupon.end_date ? new Date(coupon.end_date).toLocaleDateString() : "No expiry"}</span> },
    { key: "is_active", header: "Status", render: (coupon: Coupon) => <Badge variant={coupon.is_active ? "default" : "secondary"}>{coupon.is_active ? "Active" : "Inactive"}</Badge> },
    {
      key: "actions", header: "Actions",
      render: (coupon: Coupon) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(coupon)}><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Coupons</h1>
            <p className="text-muted-foreground">Manage discount coupons and promotions</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild><Button onClick={resetForm}><Plus className="mr-2 h-4 w-4" />Add Coupon</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editingCoupon ? "Edit Coupon" : "Add New Coupon"}</DialogTitle><DialogDescription>Fill in the coupon details below.</DialogDescription></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="code">Coupon Code *</Label><Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="SUMMER2024" required /></div>
                  <div className="space-y-2"><Label htmlFor="type">Type *</Label><Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as CouponType })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{couponTypeOptions.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent></Select></div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="discount_value">{formData.type === "percentage" ? "Discount %" : "Discount Amount"} *</Label><Input id="discount_value" type="number" value={formData.discount_value} onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })} required={formData.type !== "free_shipping"} disabled={formData.type === "free_shipping"} /></div>
                  <div className="space-y-2"><Label htmlFor="min_order_amount">Minimum Order ($)</Label><Input id="min_order_amount" type="number" step="0.01" value={formData.min_order_amount} onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })} /></div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="start_date">Start Date</Label><Input id="start_date" type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="end_date">End Date</Label><Input id="end_date" type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="max_uses">Max Uses (leave empty for unlimited)</Label><Input id="max_uses" type="number" value={formData.max_uses} onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })} placeholder="Unlimited" /></div>
                <div className="flex items-center gap-2"><Switch id="is_active" checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} /><Label htmlFor="is_active">Active</Label></div>
                <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button type="submit">{editingCoupon ? "Update" : "Create"}</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <DataTable columns={columns} data={coupons} isLoading={false} searchPlaceholder="Search coupons..." />
      </div>
    </AdminLayout>
  );
}
