import type React from "react";
import { useState } from "react";
import type { Staff } from "@/lib/type";
import { ImageUpload } from "@/components/shared/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { createStaff, updateStaff } from "@/actions/staff-actions";

// Add imports for social media icons
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";

export function StaffForm({ locationId, staff, onSuccess }) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const router = useRouter();

  const isEditing = !!staff;
  const form = useForm({
    defaultValues: {
      name: staff?.name || "",
      role: staff?.role || "",
      bio: staff?.bio || "",
      location_id: locationId || "",
      index: staff?.index?.toString() || "0",
      is_available_for_booking: staff?.is_available_for_booking !== false,
      facebook_url: staff?.facebook_url || "",
      instagram_url: staff?.instagram_url || "",
      twitter_url: staff?.twitter_url || "",
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();
        formData.append("name", value.name);
        formData.append("role", value.role);
        formData.append("bio", value.bio || "");
        formData.append("location_id", value.location_id);
        formData.append("index", value.index || "0");
        formData.append(
          "is_available_for_booking",
          value.is_available_for_booking ? "true" : "false"
        );
        formData.append("facebook_url", value.facebook_url || "");
        formData.append("instagram_url", value.instagram_url || "");
        formData.append("twitter_url", value.twitter_url || "");
        console.log("formData", formData);
        // Add the image file if it exists
        if (imageFile) {
          formData.set("image", imageFile);
        } else if (staff?.image) {
          // Keep the existing image if no new one is provided
          formData.set("image", "");
        }

        if (isEditing) {
          formData.append("id", staff.id);
          await updateStaff({ data: { staffId: staff.id, form: formData } });
          toast.success("Staff member updated successfully");
        } else {
          await createStaff({
            data: formData,
          });
          toast.success("Staff member added successfully");
        }
        router.invalidate();
        navigate({ to: "/admin" });
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("There was a problem saving the staff member");
      }
    },
  });

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const formData = new FormData(e.currentTarget);
  //     formData.append("location_id", locationId);
  //     console.log("formData", formData);

  //     // Add the image file if it exists
  //     if (imageFile) {
  //       formData.set("image", imageFile);
  //     } else if (staff?.image) {
  //       // Keep the existing image if no new one is provided
  //       formData.set("image", "");
  //     }

  //     if (isEditing) {
  //       await updateStaff({ data: { staffId: staff.id, form: formData } });
  //       toast.success("Staff member updated successfully");
  //     } else {
  //       console.log("Creating new staff member");
  //       await createStaff({ data: formData });
  //       console.log("formData", formData);
  //       toast.success("Staff member added successfully");
  //     }

  //     if (onSuccess) {
  //       onSuccess();
  //     } else {
  //       navigate({ to: `/admin/locations/${locationId}/staffs` });
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     toast.error("There was a problem saving the staff member");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
                value={field.state.value || ""}
                required
                onChange={(e) => {
                  const val = e.target.value;
                  field.handleChange(val);
                }}
              />
            </div>
          )}
        />
        <form.Field
          name="role"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Role *</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value || ""}
                placeholder="e.g. Hair Stylist, Makeup Artist"
                required
                onChange={(e) => {
                  const val = e.target.value;
                  field.handleChange(val);
                }}
              />
            </div>
          )}
        />
        <form.Field
          name="bio"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Bio</Label>
              <Textarea
                id={field.name}
                name={field.name}
                rows={4}
                value={field.state.value || ""}
                placeholder="Brief description or biography"
                onChange={(e) => {
                  const val = e.target.value;
                  field.handleChange(val);
                }}
              />
            </div>
          )}
        />

        <div className="space-y-2">
          <Label htmlFor="index">Display Order</Label>
          <Input
            id="index"
            name="index"
            type="number"
            min="0"
            defaultValue={staff?.index?.toString() || "0"}
            placeholder="Lower numbers appear first"
          />
          <p className="text-xs text-muted-foreground">
            Staff members are sorted by this number (lower numbers appear first)
          </p>
        </div>

        <form.Field
          name="is_available_for_booking"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.name}
                name={field.name}
                value="true"
                defaultChecked={staff?.is_available_for_booking !== false}
              />
              <Label htmlFor={field.name}>Available for booking</Label>
            </div>
          )}
        />

        <div className="space-y-2">
          <Label>Profile Image</Label>
          <ImageUpload onChange={setImageFile} value={staff?.image} />
        </div>

        <div className="space-y-2">
          <Label>Social Media Links</Label>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Facebook className="h-4 w-4 text-blue-600" />
                <Label htmlFor="facebook_url" className="text-sm">
                  Facebook
                </Label>
              </div>
              <Input
                id="facebook_url"
                name="facebook_url"
                type="url"
                placeholder="https://facebook.com/username"
                defaultValue={staff?.facebook_url || ""}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-pink-600" />
                <Label htmlFor="instagram_url" className="text-sm">
                  Instagram
                </Label>
              </div>
              <Input
                id="instagram_url"
                name="instagram_url"
                type="url"
                placeholder="https://instagram.com/username"
                defaultValue={staff?.instagram_url || ""}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Twitter className="h-4 w-4 text-blue-400" />
                <Label htmlFor="twitter_url" className="text-sm">
                  Twitter
                </Label>
              </div>
              <Input
                id="twitter_url"
                name="twitter_url"
                type="url"
                placeholder="https://twitter.com/username"
                defaultValue={staff?.twitter_url || ""}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            onSuccess
              ? onSuccess()
              : navigate({ to: `/admin/locations/${locationId}/staffs` });
          }}
          disabled={form.state.isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={form.state.isSubmitting}>
          {form.state.isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Staff"
            : "Add Staff"}
        </Button>
      </div>
    </form>
  );
}
