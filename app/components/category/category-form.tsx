import { createCategory, updateCategory } from "@/actions/category-actions";
import { ImageUpload } from "@/components/shared/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export function CategoryForm({ category, onSuccess }) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const router = useRouter();

  const isEditing = !!category;

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const formData = new FormData(e.currentTarget);

  //     // Add the image file if it exists
  //     if (imageFile) {
  //       formData.set("image", imageFile);
  //     } else if (category?.image) {
  //       // Keep the existing image if no new one is provided
  //       formData.set("image", "");
  //     }
  //     if (isEditing) {
  //       formData.append("id", category.id);
  //       await updateCategory({ data: formData });
  //       toast.success("Category updated", {
  //         description: "The category has been successfully updated",
  //       });
  //       router.invalidate();
  //     } else {
  //       await createCategory({ data: formData });
  //       toast.success("Category created", {
  //         description: "The category has been successfully created",
  //       });
  //       router.invalidate();
  //     }

  //     if (onSuccess) {
  //       onSuccess();
  //     } else {
  //       navigate({ to: "/" });
  //     }
  //   } catch (error: any) {
  //     toast.error("Error saving category", {
  //       description:
  //         error.message || "There was a problem saving the category.",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const form = useForm({
    defaultValues: {
      name: category?.name || "",
      index: category?.index || "",
      description: category?.description || "",
    },
    onSubmit: async () => {
      try {
        const formData = new FormData();
        if (imageFile) {
          formData.set("image", imageFile);
        } else if (category?.image) {
          formData.set("image", "");
        }
        if (isEditing) {
          formData.append("id", category.id);
          await updateCategory({ data: formData });
          toast.success("Service updated successfully");
        } else {
          await createCategory({ data: formData });
          toast.success("Service created", {
            description: "The service has been successfully created",
          });
        }
        router.invalidate();
        navigate({ to: "/admin/categories" });
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
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
              />
            </div>
          )}
        />
        <form.Field
          name="index"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor="index">Index *</Label>
              <Input
                id="index"
                type="number"
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                required
              />
            </div>
          )}
        />
        <form.Field
          name="description"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                rows={3}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />

        <div className="space-y-2">
          <Label>Category Image</Label>
          <ImageUpload onChange={setImageFile} value={category.image} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          className="mr-40"
          variant="outline"
          onClick={() => form.reset()}
        >
          Reset
        </Button>
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
