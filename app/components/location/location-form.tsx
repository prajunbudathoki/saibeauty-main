import { createLocation, updateLocation } from "@/actions/location-actions";
import { ImageUpload } from "@/components/shared/image-upload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export function LocationForm({ location, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const router = useRouter();
  const isEditing = !!location;

  const form = useForm({
    defaultValues: {
      name: location?.name || "",
      city: location?.city || "",
      address: location?.address || "",
      phone: location?.phone || "",
      email: location?.email || "",
      description: location?.description || "",
      opening_time: location?.opening_time || "09:00",
      closing_time: location?.closing_time || "18:00",
      google_maps_url: location?.google_maps_url || "",
      is_open_on_weekends: location?.is_open_on_weekends !== false,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("name", value.name);
        formData.append("city", value.city);
        formData.append("address", value.address);
        formData.append("phone", value.phone);
        formData.append("email", value.email || "");
        formData.append("description", value.description || "");
        formData.append("opening_time", value.opening_time);
        formData.append("closing_time", value.closing_time);
        formData.append(
          "is_open_on_weekends",
          value.is_open_on_weekends ? "true" : "false"
        );
        formData.append("google_maps_url", value.google_maps_url || "");

        // Add the image file if it exists
        if (imageFile) {
          formData.set("image", imageFile);
        } else if (location?.image) {
          // Keep the existing image if no new one is provided
          formData.set("image", "");
        }

        if (isEditing) {
          formData.append("id", location.id);
          await updateLocation({ data: formData });
          toast.success("Location updated successfully");
        } else {
          await createLocation({ data: formData });
          toast.success("Location created successfully");
        }

        router.invalidate();

        if (onSuccess) {
          onSuccess();
        } else {
          navigate({ to: "/admin/locations" });
        }
      } catch (error: any) {
        console.error("Error submitting form:", error);
        toast.error(
          error.message || "There was a problem saving the location."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field
            name="name"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Name *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  required
                  value={field.state.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.handleChange(val);
                  }}
                />
              </div>
            )}
          />
          <form.Field
            name="city"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>City *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  required
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

        <form.Field
          name="address"
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Address *</Label>
              <Input
                id={field.name}
                name={field.name}
                required
                value={field.state.value ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  field.handleChange(val);
                }}
              />
            </div>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field
            name="phone"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Phone *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  required
                  value={field.state.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.handleChange(val);
                  }}
                />
              </div>
            )}
          />
          <form.Field
            name="email"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
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
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field
            name="opening_time"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Opening Time *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="time"
                  required
                  value={field.state.value ?? "09:00"}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.handleChange(val);
                  }}
                />
              </div>
            )}
          />
          <form.Field
            name="closing_time"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Closing Time *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="time"
                  required
                  value={field.state.value ?? "18:00"}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.handleChange(val);
                  }}
                />
              </div>
            )}
          />
        </div>
        <form.Field
          name="google_maps_url"
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Google Maps URL</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  field.handleChange(val);
                }}
              />
            </div>
          )}
        />
        <form.Field
          name="is_open_on_weekends"
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
              <Label htmlFor={field.name}>Open on weekends</Label>
            </div>
          )}
        />
        <div className="space-y-2">
          <Label>Location Image</Label>
          <ImageUpload onChange={setImageFile} value={location?.image} />
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
              navigate({ to: "/admin/locations" });
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
            "Update Location"
          ) : (
            "Create Location"
          )}
        </Button>
      </div>
    </form>
  );
}
