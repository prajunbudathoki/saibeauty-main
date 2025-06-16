import type React from "react";
import { useState } from "react";
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
import { useForm } from "@tanstack/react-form";

export function TestimonialForm({ testimonial, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const router = useRouter();
  const isEditing = !!testimonial;

  const form = useForm({
    defaultValues: {
      name: testimonial?.name || "",
      designation: testimonial?.designation || "",
      rating: testimonial?.rating?.toString() || "5",
      review: testimonial?.review || "",
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("name", value.name);
        formData.append("designation", value.designation);
        formData.append("rating", value.rating);
        formData.append("review", value.review);

        // Add the image file if it exists
        if (imageFile) {
          formData.set("image", imageFile);
        } else if (testimonial?.image) {
          // Keep the existing image if no new one is provided
          formData.set("image", "");
        }

        if (isEditing) {
          formData.append("id", testimonial.id);
          await updateTestimonial({ data: formData });
          toast.success("Testimonial updated successfully");
        } else {
          await createTestimonial({ data: formData });
          toast.success("Testimonial created", {
            description: "Testimonial has been created successfully",
          });
        }
        router.invalidate();

        if (onSuccess) {
          onSuccess();
        } else {
          navigate({ to: "/admin/testimonials" });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("There was a problem saving the testimonial");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <form.Field
          name="name"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Name *</Label>
              <Input
                id={field.name}
                name={field.name}
                required
                onChange={(e) => {
                  const val = e.target.value;
                  field.handleChange(val);
                }}
                value={field.state.value ?? ""}
              />
            </div>
          )}
        />
        <form.Field
          name="designation"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Designation</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="e.g. Regular Customer"
                onChange={(e) => {
                  const val = e.target.value;
                  field.handleChange(val);
                }}
                value={field.state.value ?? ""}
              />
            </div>
          )}
        />
        <form.Field
          name="review"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Review *</Label>
              <Textarea
                id={field.name}
                name={field.name}
                rows={4}
                required
                onChange={(e) => {
                  const val = e.target.value;
                  field.handleChange(val);
                }}
                value={field.state.value ?? ""}
              />
            </div>
          )}
        />
        <form.Field
          name="review"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Review *</Label>
              <Textarea
                id={field.name}
                name={field.name}
                rows={4}
                required
                onChange={(e) => {
                  const val = e.target.value;
                  field.handleChange(val);
                }}
                value={field.state.value ?? ""}
              />
            </div>
          )}
        />
        <form.Field
          name="rating"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Rating *</Label>
              <Select
                defaultValue={field.state.value}
                onValueChange={field.handleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a rating" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} Star{rating > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />

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
