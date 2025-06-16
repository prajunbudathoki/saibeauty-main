import { useState } from "react";
import { ImageUpload } from "@/components/shared/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate, useRouter } from "@tanstack/react-router";
import {
  createGalleryItem,
  updateGalleryItem,
} from "@/actions/gallery-actions";
import { useForm } from "@tanstack/react-form";

export function GalleryForm({ galleryItem, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const router = useRouter();

  const isEditing = !!galleryItem;
  const form = useForm({
    defaultValues: {
      title: galleryItem?.title || "",
      description: galleryItem?.description || "",
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();
        formData.append("title", value.title);
        formData.append("description", value.description);

        // Add the image file if it exists
        if (imageFile) {
          formData.set("image", imageFile);
        } else if (galleryItem?.image) {
          // Keep the existing image if no new one is provided
          formData.set("image", "");
        }

        if (isEditing) {
          formData.append("id", galleryItem.id);
          await updateGalleryItem({ data: formData });
          toast.success("Gallery item updated successfully");
        } else {
          await createGalleryItem({ data: formData });
          toast.success("Gallery created", {
            description: "The Gallery has been created successfully",
          });
        }
        router.invalidate();

        if (onSuccess) {
          onSuccess();
        } else {
          navigate({ to: "/admin/gallery" });
        }
      } catch (error: any) {
        console.error("Error submitting form:", error);
        toast.error("There was a problem saving the gallery item");
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            defaultValue={galleryItem?.title}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={galleryItem?.description || ""}
          />
        </div>

        <div className="space-y-2">
          <Label>Image {!isEditing && "*"}</Label>
          <ImageUpload onChange={setImageFile} value={galleryItem?.image} />
          {!isEditing && (
            <p className="text-xs text-muted-foreground">
              Image is required for new gallery items
            </p>
          )}
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
              navigate({ to: "/admin/gallery" });
            }
          }}
          disabled={form.state.isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={form.state.isSubmitting}>
          {form.state.isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Gallery Item"
            : "Create Gallery Item"}
        </Button>
      </div>
    </form>
  );
}
