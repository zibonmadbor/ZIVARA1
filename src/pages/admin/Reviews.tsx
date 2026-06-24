import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  _id: string;
  product_name: string;
  customer_name: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("zivara_token");
      const res = await fetch("/api/admin/reviews", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      toast({ title: "Failed to fetch reviews", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateStatus = async (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const token = localStorage.getItem("zivara_token");
      const res = await fetch(`/api/admin/reviews/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Update failed");
      
      setReviews((prev) => prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r)));
      toast({ title: `Review ${newStatus}` });
    } catch (error) {
      toast({ title: "Failed to update review", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const token = localStorage.getItem("zivara_token");
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete");
      
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast({ title: "Review deleted successfully" });
    } catch (error) {
      toast({ title: "Failed to delete review", variant: "destructive" });
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`h-4 w-4 ${star <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
      ))}
    </div>
  );

  const columns = [
    {
      key: "review", header: "Review",
      render: (review: Review) => (
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-1">
            {renderStars(review.rating)}
            <span className="text-sm text-muted-foreground">({review.rating}/5)</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{review.comment || "No comment"}</p>
        </div>
      ),
    },
    { 
      key: "details", header: "Details", 
      render: (review: Review) => (
        <div>
          <p className="font-medium text-sm">{review.product_name}</p>
          <p className="text-xs text-muted-foreground">by {review.customer_name}</p>
        </div>
      )
    },
    { key: "created_at", header: "Date", render: (review: Review) => <span className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span> },
    {
      key: "status", header: "Status",
      render: (review: Review) => {
        if (review.status === 'approved') return <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"><CheckCircle className="mr-1 h-3 w-3" />Approved</Badge>;
        if (review.status === 'rejected') return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
      },
    },
    {
      key: "actions", header: "Actions",
      render: (review: Review) => (
        <div className="flex items-center gap-2">
          {review.status !== 'approved' && (
             <Button variant="outline" size="sm" onClick={() => updateStatus(review._id, 'approved')}>Approve</Button>
          )}
          {review.status !== 'rejected' && (
             <Button variant="outline" size="sm" onClick={() => updateStatus(review._id, 'rejected')}>Reject</Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => handleDelete(review._id)} className="text-destructive hover:text-destructive">Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Reviews</h1>
          <p className="text-muted-foreground">Moderate and manage customer reviews</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable columns={columns} data={reviews} isLoading={false} searchPlaceholder="Search reviews..." />
        )}
      </div>
    </AdminLayout>
  );
}
