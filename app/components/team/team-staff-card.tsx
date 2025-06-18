import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Facebook, Instagram, Twitter, Sparkles } from "lucide-react";
import { getStaffAverageRating } from "@/actions/review-actions";
import { StarRating } from "../shared/star-rating";
import type { Staff } from "@/generated/prisma";
import { getCdnUrl } from "@/lib/utils";

interface TeamStaffCardProps {
  staff: Staff;
  index?: number;
}

export function TeamStaffCard({ staff, index = 0 }: TeamStaffCardProps) {
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    async function loadRating() {
      try {
        const result = await getStaffAverageRating({ data: staff.id });
        if (result.averageRating !== null && result.totalReviews !== null) {
          setAverageRating(result.averageRating);
          setTotalReviews(result.totalReviews);
        }
      } catch (error) {
        console.error("Error loading staff rating:", error);
      }
    }

    loadRating();
  }, [staff.id]);

  const imageUrl = getCdnUrl(staff.image);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-all duration-300 border-primary/10 group-hover:border-primary/30">
        <div className="relative h-64 overflow-hidden">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={staff.name}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {staff.is_available_for_booking && (
            <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
              Available for booking
            </Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 w-full">
              <div className="flex justify-center space-x-3">
                {staff.facebook_url ? (
                  <a
                    href={staff.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-colors"
                  >
                    <Facebook className="h-4 w-4 text-white" />
                  </a>
                ) : null}
                {staff.instagram_url ? (
                  <a
                    href={staff.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-colors"
                  >
                    <Instagram className="h-4 w-4 text-white" />
                  </a>
                ) : null}
                {staff.twitter_url ? (
                  <a
                    href={staff.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-colors"
                  >
                    <Twitter className="h-4 w-4 text-white" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <CardHeader className="pb-2 pt-4 text-center">
          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
            {staff.name}
          </h3>
          <div className="flex items-center justify-center gap-1 text-primary">
            <Sparkles className="h-3 w-3" />
            <p className="text-sm">{staff.role}</p>
            <Sparkles className="h-3 w-3" />
          </div>
        </CardHeader>
        <CardContent className="pb-6 flex-1 text-center">
          {staff.bio && (
            <p className="text-sm text-muted-foreground">{staff.bio}</p>
          )}

          {/* Display rating */}
          <div className="mt-3 flex items-center justify-center gap-2">
            {averageRating !== null ? (
              <>
                <StarRating rating={averageRating} />
                <span className="text-xs text-muted-foreground">
                  ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
                </span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">
                No ratings yet
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
