import { createCategory, updateCategory } from "@/actions/category-actions";
import { ImageUpload } from "@/components/shared/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/generated/prisma";
import { useForm } from "@tanstack/react-form";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

type CategoryFormProps = {
  category: Category;
  onSuccess: () => void;
};

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const router = useRouter();

  const isEditing = !!category?.id;

  const form = useForm({
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      index: category?.index || 0,
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();
        formData.append("name", value.name);
        formData.append("description", value.description);
        formData.append("index", value.index.toString());

        if (imageFile) {
          formData.set("image", imageFile);
        } else if (category?.image) {
          formData.set("image", "");
        }
        if (isEditing) {
          formData.append("id", category.id);
          await updateCategory({ data: formData });
        } else {
          await createCategory({ data: formData });
        }
        toast.success(
          `Category ${isEditing ? "updated" : "created"} successfully `
        );
        await router.invalidate();
      } catch (error) {
        toast.error("There was a problem saving the category");
      }
    },
  });

  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <form.Field
          name="name"
          validators={{ onChange: ({ value }) => !value && "Required" }}
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={field.state.value}
                onChange={(e) => {
                  const val = e.target.value;
                  field.handleChange(val);
                }}
                required
              />
            </div>
          )}
        />
        <form.Field
          name="index"
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor="index">Index *</Label>
              <Input
                id="index"
                type="number"
                value={field.state.value ?? ""}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  field.handleChange(val);
                }}
                required
              />
            </div>
          )}
        />
        <form.Field
          name="description"
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
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

        <div className="space-y-2">
          <Label>Category Image</Label>
          <ImageUpload onChange={setImageFile} value={category?.image} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <div className="flex-1">
          <Button
            type="button"
            disabled={form.state.isSubmitting}
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
            onSuccess ? onSuccess() : navigate({ to: "/admin/categories" });
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={form.state.isSubmitting}>
          {form.state.isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Category"
            : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
