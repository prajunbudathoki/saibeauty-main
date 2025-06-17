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
import type { GalleryItem } from "@/generated/prisma";
import { Spinner } from "../ui/spinner";

type GalleryFormProps = {
  galleryItem: GalleryItem;
  onSuccess: () => void;
};

export function GalleryForm({ galleryItem, onSuccess }: GalleryFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const router = useRouter();

  const isEditing = !!galleryItem?.id;
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
        } else {
          await createGalleryItem({ data: formData });
        }
        toast.success(
          `Gallery ${isEditing ? "updated" : "created"} successfully`
        );
        await router.invalidate();
      } catch (error: any) {
        console.error("Error submitting form:", error);
        toast.error("There was a problem saving the gallery item");
      }
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <form.Field
            name="title"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Title *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.handleChange(val);
                  }}
                  required
                />
              </div>
            )}
          />
        </div>
        <div className="space-y-2">
          <form.Field
            name="description"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Description</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={3}
                  value={field.state.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.handleChange(val);
                  }}
                />
              </div>
            )}
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
        <div className="flex-1">
          <Button
            disabled={form.state.isSubmitting}
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
        </div>
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
          {form.state.isSubmitting ? (
            <Spinner />
          ) : isEditing ? (
            "Update Gallery Item"
          ) : (
            "Create Gallery Item"
          )}
        </Button>
      </div>
    </form>
  );
}
