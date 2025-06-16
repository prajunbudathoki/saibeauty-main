import { getCategories } from "@/actions/category-actions";
import { createService, updateService } from "@/actions/service-actions";
import { ImageUpload } from "@/components/shared/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/lib/type";
import { useForm } from "@tanstack/react-form";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ServiceForm({ service, onSuccess, categoryId }) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const navigate = useNavigate();
  const router = useRouter();

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

  const form = useForm({
    defaultValues: {
      name: service?.name || "",
      index: service?.index || 0,
      category_id: categoryId || "",
      price: service?.price || "",
      duration: service?.duration || "",
      description: service?.description || "",
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();
        formData.append("name", value.name);
        formData.append("index", value.index.toString());
        formData.append("category_id", value.category_id);
        formData.append("price", value.price.toString());
        formData.append("duration", value.duration?.toString() || "");
        formData.append("description", value.description || "");
        console.log("formdata", formData);
        if (imageFile) {
          formData.set("image", imageFile);
        } else if (service?.image) {
          formData.set("image", "");
        }

        if (isEditing) {
          formData.append("id", service.id);
          await updateService({ data: formData });
          toast.success("Service updated successfully");
        } else {
          console.log("Creating......");
          await createService({ data: formData });
          toast.success("Service created", {
            description: "The service has been successfully created",
          });
        }

        router.invalidate();
        navigate({ to: "/admin/services" });
      } catch (err) {
        console.error(err);
        toast.error("There was a problem saving the service");
      }
    },
  }); // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const formData = new FormData(e.currentTarget);
  //     // if (categoryId && !isEditing) {
  //     //   formData.set("category_id", categoryId);
  //     // }

  //     // Add the image file if it exists
  //     if (imageFile) {
  //       formData.set("image", imageFile);
  //     } else if (service?.image) {
  //       // Keep the existing image if no new one is provided
  //       formData.set("image", "");
  //     }

  //     if (isEditing) {
  //       formData.append("id", service.id);
  //       await updateService({ data: formData });
  //       toast.success("Service updated successfully");
  //     } else {
  //       await createService({ data: formData });
  //       toast.success("Service created", {
  //         description: "The service has been successfully created",
  //       });
  //     }

  //     router.invalidate();

  //     if (onSuccess) {
  //       onSuccess();
  //     } else {
  //       navigate({ to: "/admin/services" });
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     toast.error("There was a problem saving the service");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // return (
  //   <form onSubmit={handleSubmit} className="space-y-6">
  //     <div className="space-y-4">
  //       <div className="space-y-2">
  //         <Label htmlFor="name">Name *</Label>
  //         <Input id="name" name="name" defaultValue={service?.name} required />
  //       </div>

  //       <div className="space-y-2">
  //         <Label htmlFor="index">Index *</Label>
  //         <Input
  //           id="index"
  //           name="index"
  //           type="number"
  //           defaultValue={service?.index}
  //           required
  //         />
  //       </div>

  //       <div className="space-y-2">
  //         <Label htmlFor="category_id">Category *</Label>
  //         <Select
  //           name="category_id"
  //           defaultValue={categoryId || service?.category_id}
  //           required
  //           disabled={!!categoryId}
  //         >
  //           <SelectTrigger>
  //             <SelectValue placeholder="Select a category" />
  //           </SelectTrigger>
  //           <SelectContent>
  //             {categories.map((category) => (
  //               <SelectItem key={category.id} value={category.id}>
  //                 {category.name}
  //               </SelectItem>
  //             ))}
  //           </SelectContent>
  //         </Select>
  //       </div>

  //       <div className="grid gap-4 sm:grid-cols-2">
  //         <div className="space-y-2">
  //           <Label htmlFor="price">Price ($) *</Label>
  //           <Input
  //             id="price"
  //             name="price"
  //             type="number"
  //             step="0.01"
  //             min="0"
  //             defaultValue={service?.price || 20}
  //             required
  //           />
  //         </div>
  //         <div className="space-y-2">
  //           <Label htmlFor="duration">Duration (minutes)</Label>
  //           <Input
  //             id="duration"
  //             name="duration"
  //             type="number"
  //             min="0"
  //             defaultValue={service?.duration || 20}
  //           />
  //         </div>
  //       </div>

  //       <div className="space-y-2">
  //         <Label htmlFor="description">Description</Label>
  //         <Textarea
  //           id="description"
  //           name="description"
  //           rows={3}
  //           defaultValue={service?.description || "asd"}
  //         />
  //       </div>

  //       <div className="space-y-2">
  //         <Label>Service Image</Label>
  //         <ImageUpload onChange={setImageFile} value={service?.image} />
  //       </div>
  //     </div>

  //     <div className="flex justify-end gap-2">
  //       <Button
  //         type="button"
  //         variant="outline"
  //         onClick={() => {
  //           if (onSuccess) {
  //             onSuccess();
  //           } else {
  //             navigate({ to: "/admin/services" });
  //           }
  //         }}
  //         disabled={loading}
  //       >
  //         Cancel
  //       </Button>
  //       <Button type="submit" disabled={loading}>
  //         {loading
  //           ? "Saving..."
  //           : isEditing
  //           ? "Update Service"
  //           : "Create Service"}
  //       </Button>
  //     </div>
  //   </form>
  // );
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
                value={field.state.value ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  console.log("Input changde to:", val);
                  field.handleChange(val);
                }}
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
                onChange={(e) => {
                  const val = e.target.value;
                  console.log("Input changde to:", val);
                  field.handleChange(val);
                }}
                required
              />
            </div>
          )}
        />

        <form.Field
          name="category_id"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor="category_id">Category *</Label>
              <Select
                disabled={!!categoryId}
                defaultValue={field.state.value}
                onValueChange={field.handleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field
            name="price"
            // biome-ignore lint/correctness/noChildrenProp: <explanation>
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={field.state.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    console.log("Input changde to:", val);
                    field.handleChange(val);
                  }}
                />
              </div>
            )}
          />
          <form.Field
            name="duration"
            // biome-ignore lint/correctness/noChildrenProp: <explanation>
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  type="number"
                  min="0"
                  value={field.state.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    console.log("Input changde to:", val);
                    field.handleChange(val);
                  }}
                />
              </div>
            )}
          />
        </div>

        <form.Field
          name="description"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                rows={3}
                value={field.state.value}
                onChange={(e) => {
                  const val = e.target.value;
                  console.log("Input changed to:", val);
                  field.handleChange(val);
                }}
              />
            </div>
          )}
        />

        <div className="space-y-2">
          <Label>Service Image</Label>
          <ImageUpload value={service?.image} onChange={setImageFile} />
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
          onClick={() =>
            onSuccess ? onSuccess() : navigate({ to: "/admin/services" })
          }
        >
          Cancel
        </Button>

        <Button type="submit" disabled={form.state.isSubmitting}>
          {form.state.isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Service"
            : "Create Service"}
        </Button>
      </div>
    </form>
  );
}
