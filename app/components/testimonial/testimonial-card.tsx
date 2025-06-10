import { motion } from "motion/react";
import { formatDate } from "@/lib/utils";
import type { Testimonial } from "@/lib/type";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { TestimonialDialog } from "./testimonial-dialog";
import { Trash2, Edit, Star } from "lucide-react";
import { deleteTestimonial } from "@/actions/testimonial-actions";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";

export function TestimonialCard({ testimonial }) {
  const router = useRouter();
  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      await deleteTestimonial({data: testimonial.id});
      toast.success("Testimonial deleted successfully");
      router.invalidate();
    } catch (error) {
      toast.error("Failed to delete the testimonial");
    }
  };

  const imageUrl = "https://picsum.photos/200/300";

  // Render stars based on rating
  const renderStars = () => {
    const stars: React.ReactNode[] = [];
    const rating = testimonial.rating;

    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
        );
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-muted-foreground" />);
      }
    }

    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={testimonial.name}
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">{testimonial.name}</h3>
              {testimonial.designation && (
                <p className="text-sm text-muted-foreground">
                  {testimonial.designation}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2 flex-1">
          <div className="flex mb-2">{renderStars()}</div>

          <p className="text-sm">"{testimonial.review}"</p>

          <div className="mt-2 text-xs text-muted-foreground">
            {formatDate(testimonial.created_at)}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-2 border-t">
          <div className="flex gap-2">
            <TestimonialDialog
              testimonial={testimonial}
              title="Edit Testimonial"
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />

            <ConfirmDialog
              title="Delete Testimonial"
              description="Are you sure you want to delete this testimonial? This action cannot be undone."
              onConfirm={() => handleDelete(testimonial.id)}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
