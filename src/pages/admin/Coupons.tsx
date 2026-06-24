import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Ticket, Percent, DollarSign, Truck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CouponType = "percentage" | "fixed";

interface Coupon {
  _id: string;
  code: string;
  discount_type: CouponType;
  discount_value: number;
  min_order_amount: number;
  usage_limit: number | null;
  times_used: number;
  valid_until: string;
  is_active: boolean;
  createdAt: string;
}

const couponTypeOptions = [
  { value: "percentage", label: "Percentage Off", icon: Percent },
  { value: "fixed", label: "Fixed Amount", icon: DollarSign },
];

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage" as CouponType,
    discount_value: "",
    min_order_amount: "0",
    valid_until: "",
    is_active: true
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("zivara_token");
      const res = await fetch("/api/admin/coupons", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (error) {
      toast({ title: "Failed to fetch coupons", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("zivara_token");
      const payload = {
        code: formData.code,
        discount_type: formData.discount_type,
        discount_value: Number(formData.discount_value),
        min_order_amount: Number(formData.min_order_amount),
        valid_until: formData.valid_until,
        is_active: formData.is_active
      };

      const url = editingCoupon ? `/api/admin/coupons/${editingCoupon._id}` : "/api/admin/coupons";
      const method = editingCoupon ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save coupon");

      toast({ title: editingCoupon ? "Coupon updated" : "Coupon created" });
      setIsDialogOpen(false);
      fetchCoupons();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      min_order_amount: coupon.min_order_amount.toString(),
      valid_until: coupon.valid_until ? coupon.valid_until.split("T")[0] : "",
      is_active: coupon.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const token = localStorage.getItem("zivara_token");
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast({ title: "Coupon deleted" });
      fetchCoupons();
    } catch (error) {
      toast({ title: "Failed to delete coupon", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      discount_type: "percentage",
      discount_value: "",
      min_order_amount: "0",
      valid_until: "",
      is_active: true
    });
  };

  const getTypeIcon = (type: string) => {
    return type === "percentage" ? <Percent className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />;
  };

  const formatDiscount = (coupon: Coupon) => {
    return coupon.discount_type === "percentage" ? `${coupon.discount_value}%` : `$${coupon.discount_value}`;
  };

  const columns = [
    {
      key: "code", header: "Coupon",
      render: (coupon: Coupon) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            {getTypeIcon(coupon.discount_type)}
          </div>
          <div>
            <p className="font-mono font-medium">{coupon.code}</p>
            <p className="text-xs text-muted-foreground capitalize">{coupon.discount_type}</p>
          </div>
        </div>
      ),
    },
    { key: "discount", header: "Discount", render: (coupon: Coupon) => <span className="font-semibold text-primary">{formatDiscount(coupon)}</span> },
    { key: "usage", header: "Usage", render: (coupon: Coupon) => <span className="text-muted-foreground">{coupon.times_used} / {coupon.usage_limit || "∞"}</span> },
    { key: "validity", header: "Valid Until", render: (coupon: Coupon) => <span className="text-sm text-muted-foreground">{new Date(coupon.valid_until).toLocaleDateString()}</span> },
    { key: "is_active", header: "Status", render: (coupon: Coupon) => <Badge variant={coupon.is_active ? "default" : "secondary"}>{coupon.is_active ? "Active" : "Inactive"}</Badge> },
    {
      key: "actions", header: "Actions",
      render: (coupon: Coupon) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(coupon)}><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild><Button onClick={resetForm}><Plus className="mr-2 h-4 w-4" />Add Coupon</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editingCoupon ? "Edit Coupon" : "Add New Coupon"}</DialogTitle><DialogDescription>Fill in the coupon details below.</DialogDescription></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="code">Coupon Code *</Label><Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="SUMMER2024" required /></div>
                  <div className="space-y-2"><Label htmlFor="type">Type *</Label><Select value={formData.discount_type} onValueChange={(value) => setFormData({ ...formData, discount_type: value as CouponType })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{couponTypeOptions.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent></Select></div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="discount_value">{formData.discount_type === "percentage" ? "Discount %" : "Discount Amount"} *</Label><Input id="discount_value" type="number" value={formData.discount_value} onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })} required /></div>
                  <div className="space-y-2"><Label htmlFor="min_order_amount">Minimum Order ($)</Label><Input id="min_order_amount" type="number" step="0.01" value={formData.min_order_amount} onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })} /></div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="valid_until">Valid Until *</Label><Input id="valid_until" type="date" value={formData.valid_until} onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })} required /></div>
                </div>
                <div className="flex items-center gap-2"><Switch id="is_active" checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} /><Label htmlFor="is_active">Active</Label></div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingCoupon ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable columns={columns} data={coupons} isLoading={false} searchPlaceholder="Search coupons..." />
        )}
      </div>
    </AdminLayout>
  );
}
