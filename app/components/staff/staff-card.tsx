import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StaffDialog } from "./staff-dialog";
// Update the imports to ensure we have the social media icons
import {
  Trash2,
  Edit,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Star,
} from "lucide-react";
import { deleteStaff } from "@/actions/staff-actions";
import { getStaffAverageRating } from "@/actions/review-actions";
import { toast } from "sonner";
// First, import the Badge component
import { Badge } from "@/components/ui/badge";
import { StarRating } from "../shared/star-rating";
import { Link } from "@tanstack/react-router";
import type { Staff } from "@/generated/prisma";
// Keep the rest of the imports

interface StaffCardProps {
  staff: Staff;
  locationId: string;
}

export function StaffCard({ staff, locationId }: StaffCardProps) {
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    async function loadRating() {
      try {
        const result = await getStaffAverageRating({ data: staff.id });
        if (result) {
          setAverageRating(result.averageRating);
          setTotalReviews(result.totalReviews || 0);
        } else {
          setAverageRating(null);
          setTotalReviews(0);
        }
      } catch (error) {
        console.error("Error loading staff rating:", error);
        setAverageRating(null);
        setTotalReviews(0);
      }
    }

    loadRating();
  }, [staff.id]);

  const handleDelete = async () => {
    try {
      await deleteStaff({ data: staff.id });
      toast.success("Staff member deleted successfully");
    } catch (error) {
      toast.error("Failed to delete the staff member");
    }
  };

  const imageUrl = staff.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={staff.name}
            className="object-cover w-full h-48"
          />
          {/* Add availability badge in the top-right corner of the image */}
          {staff.is_available_for_booking && (
            <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
              Available for booking
            </Badge>
          )}
          {!staff.is_available_for_booking && (
            <Badge className="absolute top-2 right-2 bg-gray-500 hover:bg-gray-600">
              Not available
            </Badge>
          )}
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg ">{staff.name}</h3>
              <p className="text-sm text-muted-foreground">{staff.role}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2 flex-1">
          {staff.bio && <p className="text-sm line-clamp-3">{staff.bio}</p>}

          {/* Display rating */}
          <div className="mt-2 flex items-center gap-2">
            <StarRating rating={averageRating} size="sm" />
            {totalReviews > 0 && (
              <span className="text-xs text-muted-foreground">
                ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
              </span>
            )}
          </div>
        </CardContent>
        {/* Find the CardFooter section and update it to include social links: */}
        <CardFooter className="flex justify-between pt-2 border-t">
          <div className="flex gap-2">
            {staff.facebook_url || staff.instagram_url || staff.twitter_url ? (
              <div className="flex gap-1">
                {staff.facebook_url && (
                  <a
                    href={staff.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {staff.instagram_url && (
                  <a
                    href={staff.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-800"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {staff.twitter_url && (
                  <a
                    href={staff.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
              </div>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
            >
              <Link
                to={"/admin/locations/$id/staffs/$staffid/reviews"}
                params={{
                  id: locationId,
                  staffid: staff.id,
                }}
              >
                <div>
                  <Star className="h-4 w-4" />
                </div>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
            >
              <Link
                to={"/admin/locations/$id/staffs/$staffid/schedules"}
                params={{
                  id: locationId,
                  staffid: staff.id,
                }}
              >
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </Link>
            </Button>
            <StaffDialog
              locationId={locationId}
              staff={staff}
              title="Edit Staff Member"
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <div>
                    <Edit className="h-4 w-4" />
                  </div>
                </Button>
              }
            />
            <ConfirmDialog
              title="Delete Staff Member"
              description="Are you sure you want to delete this staff member? This action cannot be undone."
              onConfirm={handleDelete}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                >
                  <div>
                    <Trash2 className="h-4 w-4" />
                  </div>
                </Button>
              }
            />
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
