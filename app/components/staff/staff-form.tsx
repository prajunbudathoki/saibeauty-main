import { createStaff, updateStaff } from "@/actions/staff-actions";
import { ImageUpload } from "@/components/shared/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Staff } from "@/lib/type";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface StaffFormProps {
  locationId: string;
  staff?: Staff;
  onSuccess?: () => void;
}

export function StaffForm({ locationId, staff, onSuccess }: StaffFormProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const isEditing = !!staff;

  const form = useForm({
    defaultValues: {
      name: staff?.name || "",
      role: staff?.role || "",
      bio: staff?.bio || "",
      index: staff?.index?.toString() || "0",
      is_available_for_booking: staff?.is_available_for_booking !== false,
      facebook_url: staff?.facebook_url || "",
      instagram_url: staff?.instagram_url || "",
      twitter_url: staff?.twitter_url || "",
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("name", value.name);
        formData.append("role", value.role);
        formData.append("bio", value.bio);
        formData.append("index", value.index);
        formData.append(
          "is_available_for_booking",
          String(value.is_available_for_booking)
        );
        formData.append("facebook_url", value.facebook_url);
        formData.append("instagram_url", value.instagram_url);
        formData.append("twitter_url", value.twitter_url);

        // Add the image file if it exists
        if (imageFile) {
          formData.set("image", imageFile);
        } else if (staff?.image) {
          // Keep the existing image if no new one is provided
          formData.set("image", "");
        }

        if (isEditing) {
          await updateStaff({ data: { staffId: staff.id, form: formData } });
          toast.success("Staff member updated successfully");
        } else {
          await createStaff({
            data: { location_id: locationId, form: formData },
          });
          toast.success("Staff member added successfully");
        }

        if (onSuccess) {
          onSuccess();
        } else {
          navigate({ to: `/admin/locations/${locationId}/staffs` });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("There was a problem saving the staff member");
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
                value={staff?.name ?? ""}
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
          name="role"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Role *</Label>
              <Input
                id={field.name}
                name={field.name}
                value={staff?.role ?? ""}
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
          name="bio"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Bio</Label>
              <Textarea
                id={field.name}
                name={field.name}
                rows={4}
                value={staff?.bio ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  field.handleChange(val);
                }}
                placeholder="Brief description or biography"
              />
            </div>
          )}
        />
        <form.Field
          name="index"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Display Order</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min="0"
                value={staff?.index?.toString() || "0"}
                onChange={(e) => {
                  const val = e.target.value;
                  field.handleChange(val);
                }}
                placeholder="Lower numbers appear first"
              />
              <p className="text-xs text-muted-foreground">
                Staff members are sorted by this number (lower numbers appear
                first)
              </p>
            </div>
          )}
        />
        <form.Field
          name="is_available_for_booking"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.name}
                name={field.name}
                value="true"
                checked={field.state.value !== false}
                onChange={(e) => {
                  const val = (e.target as HTMLInputElement).checked;
                  field.handleChange(val);
                }}
              />
              <Label htmlFor={field.name}>Available for booking</Label>
            </div>
          )}
        />

        <div className="space-y-2">
          <Label>Profile Image</Label>
          <ImageUpload
            onChange={setImageFile}
            value={imageFile ? undefined : staff?.image ?? null}
          />
        </div>

        <form.Field
          name="facebook_url"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Facebook className="h-4 w-4 text-blue-600" />
                <Label htmlFor={field.name} className="text-sm">
                  Facebook
                </Label>
              </div>
              <Input
                id={field.name}
                name={field.name}
                type="url"
                placeholder="https://facebook.com/username"
                value={staff?.facebook_url || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  field.handleChange(val);
                }}
              />
            </div>
          )}
        />
        <form.Field
          name="instagram_url"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-pink-600" />
                <Label htmlFor={field.name} className="text-sm">
                  Instagram
                </Label>
              </div>
              <Input
                id={field.name}
                name={field.name}
                type="url"
                placeholder="https://instagram.com/username"
                value={staff?.instagram_url || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  field.handleChange(val);
                }}
              />
            </div>
          )}
        />
        <form.Field
          name="twitter_url"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Twitter className="h-4 w-4 text-blue-400" />
                <Label htmlFor={field.name} className="text-sm">
                  Twitter
                </Label>
              </div>
              <Input
                id={field.name}
                name={field.name}
                type="url"
                placeholder="https://twitter.com/username"
                value={staff?.twitter_url || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  field.handleChange(val);
                }}
              />
            </div>
          )}
        />
      </div>
    </form>
  );
}
