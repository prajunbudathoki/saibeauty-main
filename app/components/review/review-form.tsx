import type React from "react";
import { useState } from "react";
import { submitReview } from "@/actions/review-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { useForm } from "@tanstack/react-form";

export function ReviewForm({ appointmentId, onReviewSubmitted }) {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitReview({
        data: { appointmentId, rating, review },
      });
      toast.success("Thank you for your review!");
      setRating(0);
      setReview("");
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      return result;
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Your Rating <input />{" "}
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(null)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                } transition-colors`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="review" className="block text-sm font-medium">
          Your Review (Optional)
        </label>
        <Textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience..."
          className="min-h-[100px]"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
