"use client";

import type React from "react";

import { useState } from "react";
import type { Category } from "@/lib/type";
import { ImageUpload } from "@/components/shared/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createCategory } from "@/actions/category-actions";
import { toast } from "sonner";
import { useNavigate, useRouter } from "@tanstack/react-router";

interface CategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const router = useRouter();

  const isEditing = !!category;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Add the image file if it exists
      // if (imageFile) {
      //   formData.set("image", imageFile);
      // } else if (category?.image) {
      //   // Keep the existing image if no new one is provided
      //   formData.set("image", "");
      // }

      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const index = Number(formData.get("index"));
      await createCategory({ data: { name, description, index } });
      toast.success("Category created", {
        description: "The category has been successfully created",
      });
      router.invalidate();

      // if (isEditing) {
      //   await updateCategory(category.id, formData);
      //   toast.success("Category updated", {
      //     description: "The category has been updated successfully.",
      //   });
      // } else {
      //   await createCategory(formData);
      //   toast.success("Category created", {
      //     description: "The category has been created successfully.",
      //   });
      // }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate({ to: "/" });
      }
    } catch (error: any) {
      toast.error("Error saving category", {
        description:
          error.message || "There was a problem saving the category.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" defaultValue={category?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="index">Index *</Label>
          <Input
            id="index"
            name="index"
            defaultValue={category?.index || 0}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={category?.description || ""}
          />
        </div>

        <div className="space-y-2">
          <Label>Category Image</Label>
          <ImageUpload
            onChange={setImageFile}
            value={"https://picsum.photos/id/237/200/300"}
          />
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
            ? "Update Category"
            : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
