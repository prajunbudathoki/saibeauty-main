import type React from "react";
import { useState } from "react";
import type { Testimonial } from "@/lib/type";
import { ImageUpload } from "@/components/shared/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  createTestimonial,
  updateTestimonial,
} from "@/actions/testimonial-actions";
import { useNavigate, useRouter } from "@tanstack/react-router";

export function TestimonialForm({
  testimonial,
  onSuccess,
}: {
  testimonial?: Testimonial;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const router = useRouter();
  const isEditing = !!testimonial;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);

      // Add the image file if it exists
      if (imageFile) {
        formData.set("image", imageFile);
      } else if (testimonial?.image) {
        // Keep the existing image if no new one is provided
        formData.set("image", "");
      }
      // converting the fields into object as formData was not converted by serverfn
      // const plainData = Object.fromEntries(formData.entries());
      // plainData.rating = Number(plainData.rating);
      if (isEditing) {
        await updateTestimonial({ data: formData });
        toast.success("Testimonial updated successfully");
        router.invalidate();
      } else {
        await createTestimonial({ data: formData });
        toast.success("Testimonial created successfully");
        router.invalidate();
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate({ to: "/" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was a problem saving the testimonial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            defaultValue={testimonial?.name}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            name="designation"
            defaultValue={testimonial?.designation || ""}
            placeholder="e.g. Regular Customer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Rating *</Label>
          <Select
            name="rating"
            defaultValue={testimonial?.rating?.toString() || "5"}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Star</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="review">Review *</Label>
          <Textarea
            id="review"
            name="review"
            rows={4}
            defaultValue={testimonial?.review}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Customer Photo</Label>
          <ImageUpload onChange={setImageFile} value={null} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (onSuccess) {
              onSuccess();
            } else {
              navigate({ to: "/" });
            }
          }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : isEditing
            ? "Update Testimonial"
            : "Create Testimonial"}
        </Button>
      </div>
    </form>
  );
}
