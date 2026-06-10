
// ============================================================
// ADMIN FLASH SALES PAGE - Frontend Only (Mock Data)
// ============================================================
// TODO: Replace mock data with real API calls:
//   GET    /api/admin/flash-sales        -> list all flash sales
//   POST   /api/admin/flash-sales        -> create flash sale
//   PUT    /api/admin/flash-sales/:id    -> update flash sale
//   DELETE /api/admin/flash-sales/:id    -> delete flash sale
//   GET    /api/admin/products           -> list products for selector
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
import { Plus, Pencil, Trash2, Zap, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { products as catalogProducts } from "@/data/products";

interface FlashSale {
  id: string;
  name: string;
  product_id: string | null;
  discount_percentage: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
}

// TODO: Fetch from GET /api/admin/products
const PRODUCT_OPTIONS = catalogProducts.map((p) => ({ id: p.id, name: p.name }));

const MOCK_FLASH_SALES: FlashSale[] = [
  { id: "1", name: "Summer Flash Sale", product_id: null, discount_percentage: 30, start_time: "2024-06-15T10:00:00Z", end_time: "2024-06-15T18:00:00Z", is_active: false, created_at: "2024-06-01T00:00:00Z" },
  { id: "2", name: "Weekend Special", product_id: "1", discount_percentage: 20, start_time: "2024-08-10T00:00:00Z", end_time: "2024-08-12T23:59:00Z", is_active: true, created_at: "2024-08-01T00:00:00Z" },
];

export default function AdminFlashSales() {
  const [flashSales, setFlashSales] = useState<FlashSale[]>(MOCK_FLASH_SALES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<FlashSale | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({ name: "", product_id: "", discount_percentage: "", start_time: "", end_time: "", is_active: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const saleData: FlashSale = {
      id: editingSale?.id || Date.now().toString(),
      name: formData.name,
      product_id: formData.product_id || null,
      discount_percentage: parseInt(formData.discount_percentage),
      start_time: new Date(formData.start_time).toISOString(),
      end_time: new Date(formData.end_time).toISOString(),
      is_active: formData.is_active,
      created_at: editingSale?.created_at || new Date().toISOString(),
    };
    // TODO: PUT /api/admin/flash-sales/:id or POST /api/admin/flash-sales
    if (editingSale) {
      setFlashSales((prev) => prev.map((s) => (s.id === editingSale.id ? saleData : s)));
      toast({ title: "Flash sale updated successfully" });
    } else {
      setFlashSales((prev) => [saleData, ...prev]);
      toast({ title: "Flash sale created successfully" });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (sale: FlashSale) => {
    setEditingSale(sale);
    setFormData({ name: sale.name, product_id: sale.product_id || "", discount_percentage: sale.discount_percentage.toString(), start_time: sale.start_time.slice(0, 16), end_time: sale.end_time.slice(0, 16), is_active: sale.is_active });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this flash sale?")) return;
    // TODO: DELETE /api/admin/flash-sales/:id
    setFlashSales((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Flash sale deleted successfully" });
  };

  const resetForm = () => {
    setEditingSale(null);
    setFormData({ name: "", product_id: "", discount_percentage: "", start_time: "", end_time: "", is_active: true });
  };

  const getSaleStatus = (sale: FlashSale) => {
    const now = new Date();
    const start = new Date(sale.start_time);
    const end = new Date(sale.end_time);
    if (!sale.is_active) return { label: "Inactive", color: "bg-muted text-muted-foreground" };
    if (now < start) return { label: "Scheduled", color: "bg-blue-500/20 text-blue-400" };
    if (now > end) return { label: "Ended", color: "bg-destructive/20 text-destructive" };
    return { label: "Active", color: "bg-primary/20 text-primary" };
  };

  const columns = [
    {
      key: "name", header: "Flash Sale",
      render: (sale: FlashSale) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{sale.name}</p>
            <p className="text-xs text-primary font-semibold">{sale.discount_percentage}% OFF</p>
          </div>
        </div>
      ),
    },
    {
      key: "timing", header: "Duration",
      render: (sale: FlashSale) => (
        <div className="text-sm">
          <div className="flex items-center gap-1 text-muted-foreground"><Timer className="h-3 w-3" /><span>{new Date(sale.start_time).toLocaleString()}</span></div>
          <div className="text-muted-foreground">to {new Date(sale.end_time).toLocaleString()}</div>
        </div>
      ),
    },
    {
      key: "status", header: "Status",
      render: (sale: FlashSale) => {
        const status = getSaleStatus(sale);
        return <Badge className={status.color}>{status.label}</Badge>;
      },
    },
    {
      key: "actions", header: "Actions",
      render: (sale: FlashSale) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(sale)}><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(sale.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Flash Sales</h1>
            <p className="text-muted-foreground">Create time-limited discount campaigns</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild><Button onClick={resetForm}><Plus className="mr-2 h-4 w-4" />Create Flash Sale</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editingSale ? "Edit Flash Sale" : "Create Flash Sale"}</DialogTitle><DialogDescription>Set up a time-limited discount campaign.</DialogDescription></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2"><Label htmlFor="name">Campaign Name *</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Summer Flash Sale" required /></div>
                <div className="space-y-2">
                  <Label htmlFor="product">Product (optional)</Label>
                  <Select value={formData.product_id} onValueChange={(value) => setFormData({ ...formData, product_id: value })}>
                    <SelectTrigger><SelectValue placeholder="All products" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Products</SelectItem>
                      {PRODUCT_OPTIONS.map((product) => <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label htmlFor="discount_percentage">Discount Percentage *</Label><Input id="discount_percentage" type="number" min="1" max="100" value={formData.discount_percentage} onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })} placeholder="20" required /></div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="start_time">Start Time *</Label><Input id="start_time" type="datetime-local" value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} required /></div>
                  <div className="space-y-2"><Label htmlFor="end_time">End Time *</Label><Input id="end_time" type="datetime-local" value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} required /></div>
                </div>
                <div className="flex items-center gap-2"><Switch id="is_active" checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} /><Label htmlFor="is_active">Active</Label></div>
                <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button type="submit">{editingSale ? "Update" : "Create"}</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <DataTable columns={columns} data={flashSales} isLoading={false} searchPlaceholder="Search flash sales..." />
      </div>
    </AdminLayout>
  );
}
