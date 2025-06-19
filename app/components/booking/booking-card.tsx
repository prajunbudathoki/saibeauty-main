import { cancelBooking } from "@/actions/booking-actions";
import { AppointmentStatusBadge } from "@/components/appointment/appointment-status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import {
  AlertTriangle,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Scissors,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StarRating } from "../shared/star-rating";
import { ReviewForm } from "@/components/review/review-form";

interface BookingCardProps {
  booking: any;
  onCancelled?: () => void;
}

export function BookingCard({ booking, onCancelled }: BookingCardProps) {
  const [cancelling, setCancelling] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const isUpcoming = new Date(booking.start_time) > new Date();
  const canCancel = isUpcoming && booking.status !== "cancelled";
  const canReview = booking.status === "completed" && !booking.rating;
  const hasReview = booking.rating !== null;

  const handleCancelBooking = async () => {
    setCancelling(true);
    try {
      await cancelBooking({ data: booking.id });
      toast.success("Booking cancelled successfully");
      if (onCancelled) onCancelled();
    } catch (error) {
      toast.error("Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    if (onCancelled) onCancelled(); // Refresh the booking data
  };
  const imageurl = undefined;

  // Calculate total services
  const totalServices = booking.services?.length || 0;

  return (
    <Card className="overflow-hidden border-muted hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md">
      <CardContent className="p-6 space-y-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">
                {format(booking.start_time, "EEEE, MMMM d, yyyy")}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {format((booking.start_time), "h:mm a")} -{" "}
                {format((booking.end_time), "h:mm a")}
              </div>
            </div>
          </div>
          <AppointmentStatusBadge status={booking.status} className={""} />
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{booking.location?.name}</div>
            <div className="text-sm text-muted-foreground">
              {booking.location?.address}, {booking.location?.city}
            </div>
          </div>
        </div>

        {booking.staff && (
          <div className="flex items-start gap-3">
            {booking.staff.image ? (
              <img
                src={imageurl}
                alt={booking.staff.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="bg-primary/10 p-2 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
            )}
            <div>
              <div className="font-medium">{booking.staff.name}</div>
              <div className="text-sm text-muted-foreground">
                {booking.staff.role}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Scissors className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-medium mb-2">Services ({totalServices})</div>
            <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
              {booking.services?.map((service: any) => (
                <div key={service.id} className="text-sm flex justify-between">
                  <span>{service.location_service?.service?.name}</span>
                  <span className="font-medium">
                    {formatPrice(service.price)}
                  </span>
                </div>
              ))}
              <div className="text-sm font-medium flex justify-between pt-2 border-t border-muted">
                <span>Total</span>
                <span className="text-primary">
                  {formatPrice(booking.total_price)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {hasReview && (
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">Your Review</div>
              <div className="mb-2">
                <StarRating rating={booking.rating} />
              </div>
              {booking.review && (
                <div className="bg-muted/30 p-3 rounded-lg text-sm">
                  {booking.review}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-muted/30 px-6 py-4 flex justify-end gap-2">
        {canReview && (
          <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
            <DialogTrigger asChild>
              <Button variant="outline">Leave a Review</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rate Your Experience</DialogTitle>
              </DialogHeader>
              <ReviewForm
                appointmentId={booking.id}
                onReviewSubmitted={handleReviewSubmitted}
              />
            </DialogContent>
          </Dialog>
        )}

        {canCancel && (
          <ConfirmDialog
            title="Cancel Booking"
            description={
              <div className="flex flex-col items-center gap-3 py-3">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-center">
                  <p>Are you sure you want to cancel this booking?</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            }
            onConfirm={handleCancelBooking}
            trigger={
              <Button
                variant="outline"
                disabled={cancelling}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                {cancelling ? "Cancelling..." : "Cancel Booking"}
              </Button>
            }
          />
        )}
      </CardFooter>
    </Card>
  );
}
