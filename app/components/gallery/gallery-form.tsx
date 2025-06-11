import type React from "react";

import { useState } from "react";
import type { GalleryItem } from "@/lib/type";
import { ImageUpload } from "@/components/shared/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import {
  createGalleryItem,
  updateGalleryItem,
} from "@/actions/gallery-actions";

export function GalleryForm({ galleryItem, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const isEditing = !!galleryItem;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Add the image file if it exists
      if (imageFile) {
        formData.set("image", imageFile);
      } else if (galleryItem?.image) {
        // Keep the existing image if no new one is provided
        formData.set("image", "");
      }

      if (isEditing) {
        await updateGalleryItem({ data: { id: galleryItem.id, formData } });
        toast.success("Gallery item updated successfully");
      } else {
        if (!imageFile) {
          throw new Error("Image is required");
        }
        await createGalleryItem({ data: { formData } });
        toast.success("Gallery item created successfully");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate({ to: "/" });
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(
        error.message || "There was a problem saving the gallery item"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <ImageUpload
            onChange={setImageFile}
            value={
              galleryItem?.image
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/saibeauty/${galleryItem.image}`
                : null
            }
          />
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
            ? "Update Gallery Item"
            : "Create Gallery Item"}
        </Button>
      </div>
    </form>
  );
}
