
// ============================================================
// ADMIN REVIEWS PAGE - Frontend Only (Mock Data)
// ============================================================
// TODO: Replace mock data with real API calls:
//   GET    /api/admin/reviews           -> list all reviews
//   PUT    /api/admin/reviews/:id       -> approve/hide { is_approved }
//   DELETE /api/admin/reviews/:id       -> delete review
// ============================================================

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  product_id: string;
  customer_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
}

const MOCK_REVIEWS: Review[] = [
  { id: "1", product_id: "1", customer_id: "3", rating: 5, title: "Amazing quality!", comment: "The fabric is incredibly soft and the fit is perfect. Highly recommend!", is_approved: true, created_at: "2024-02-01T00:00:00Z" },
  { id: "2", product_id: "2", customer_id: "4", rating: 4, title: "Great product", comment: "Really happy with this purchase. Shipping was fast too.", is_approved: true, created_at: "2024-02-10T00:00:00Z" },
  { id: "3", product_id: "3", customer_id: "5", rating: 2, title: "Not as expected", comment: "The color looked different in the photos. Material is okay though.", is_approved: false, created_at: "2024-02-15T00:00:00Z" },
  { id: "4", product_id: "1", customer_id: "4", rating: 5, title: "Best purchase ever", comment: "Absolutely love it! Will definitely buy more from Zivara.", is_approved: false, created_at: "2024-03-01T00:00:00Z" },
];

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const { toast } = useToast();

  const toggleApproval = (id: string, currentStatus: boolean) => {
    // TODO: PUT /api/admin/reviews/:id  { is_approved: !currentStatus }
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, is_approved: !currentStatus } : r)));
    toast({ title: currentStatus ? "Review hidden" : "Review approved" });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    // TODO: DELETE /api/admin/reviews/:id
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast({ title: "Review deleted successfully" });
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
          {review.title && <p className="font-medium">{review.title}</p>}
          <p className="text-sm text-muted-foreground line-clamp-2">{review.comment || "No comment"}</p>
        </div>
      ),
    },
    { key: "created_at", header: "Date", render: (review: Review) => <span className="text-sm text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span> },
    {
      key: "is_approved", header: "Status",
      render: (review: Review) => (
        <Badge variant={review.is_approved ? "default" : "secondary"}>
          {review.is_approved ? <><CheckCircle className="mr-1 h-3 w-3" />Approved</> : <><XCircle className="mr-1 h-3 w-3" />Pending</>}
        </Badge>
      ),
    },
    {
      key: "actions", header: "Actions",
      render: (review: Review) => (
        <div className="flex items-center gap-2">
          <Button variant={review.is_approved ? "outline" : "default"} size="sm" onClick={() => toggleApproval(review.id, review.is_approved)}>
            {review.is_approved ? "Hide" : "Approve"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(review.id)} className="text-destructive hover:text-destructive">Delete</Button>
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
        <DataTable columns={columns} data={reviews} isLoading={false} searchPlaceholder="Search reviews..." />
      </div>
    </AdminLayout>
  );
}
