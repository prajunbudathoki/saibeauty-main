"use client";

import type React from "react";

import { useState, useEffect } from "react";
import type { Service, Category } from "@/lib/type";
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
import { createService } from "@/actions/service-actions";
import { getCategories } from "@/actions/category-actions";
import { useNavigate } from "@tanstack/react-router";

interface ServiceFormProps {
  service?: Service;
  onSuccess?: () => void;
  categoryId?: string;
}

export function ServiceForm({
  service,
  onSuccess,
  categoryId,
}: ServiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const navigate = useNavigate();

  const isEditing = !!service;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(
          data.map((cat) => ({
            ...cat,
            created_at:
              cat.created_at instanceof Date
                ? cat.created_at.toISOString()
                : cat.created_at,
          }))
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      if (categoryId && !isEditing) {
        formData.set("category_id", categoryId);
      }

      // Add the image file if it exists
      if (imageFile) {
        formData.set("image", imageFile);
      } else if (service?.image) {
        // Keep the existing image if no new one is provided
        formData.set("image", "");
      }

      //   if (isEditing) {
      //     await updateService(service.id, formData)
      //     toast.success("Service updated successfully")
      //   } else {
      //     await createService(formData)
      //     toast.success("Service created successfully")
      //   }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate({ to: "/admin/services" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was a problem saving the service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" defaultValue={service?.name} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="index">Index *</Label>
          <Input
            id="index"
            name="index"
            type="number"
            defaultValue={service?.index || 0}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category_id">Category *</Label>
          <Select
            name="category_id"
            defaultValue={categoryId || service?.category_id}
            required
            disabled={!!categoryId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Price ($) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={service?.price}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              min="0"
              defaultValue={service?.duration || ""}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={service?.description || ""}
          />
        </div>

        <div className="space-y-2">
          <Label>Service Image</Label>
          <ImageUpload
            onChange={setImageFile}
            value={
              service?.image
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/saibeauty/${service.image}`
                : null
            }
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
              navigate({ to: "/admin/services" });
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
            ? "Update Service"
            : "Create Service"}
        </Button>
      </div>
    </form>
  );
}
