"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import {
  getStaffReviews,
  getStaffAverageRating,
} from "@/actions/review-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "../shared/star-rating";
import { Loader2 } from "lucide-react";

interface StaffReviewsProps {
  staffId: string;
}

export function StaffReviews({ staffId }: StaffReviewsProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReviews() {
      setLoading(true);
      try {
        const [reviewsResult, ratingResult] = await Promise.all([
          getStaffReviews({ data: staffId }),
          getStaffAverageRating({ data: staffId }),
        ]);

        setReviews(Array.isArray(reviewsResult) ? reviewsResult : []);
        setAverageRating(ratingResult?.averageRating ?? null);
        setTotalReviews(ratingResult?.totalReviews ?? 0);
        setError(null);
      } catch (err) {
        setError("Failed to load reviews");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, [staffId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-800">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex flex-col items-center justify-center bg-primary/5 p-4 rounded-lg min-w-[100px]">
              <div className="text-3xl font-bold text-primary">
                {averageRating === null ? "-" : averageRating}
              </div>
              <StarRating rating={averageRating} />
              <div className="text-sm text-muted-foreground mt-1">
                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </div>
            </div>
            <div>
              {averageRating === null ? (
                <p className="text-muted-foreground">
                  This staff member has not received any reviews yet.
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Based on {totalReviews}{" "}
                  {totalReviews === 1 ? "review" : "reviews"} from customers who
                  had appointments with this staff member.
                </p>
              )}
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-8 bg-muted/30 rounded-md">
              <p className="text-muted-foreground">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{review.customer_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(parseISO(review.start_time), "MMMM d, yyyy")}
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  {review.review && (
                    <p className="text-sm mt-2">{review.review}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
