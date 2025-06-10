import { createLocation, updateLocation } from "@/actions/location-actions";
import { ImageUpload } from "@/components/shared/image-upload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useRouter } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

export function LocationForm({ location, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const router = useRouter();
  const isEditing = !!location;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Add the image file if it exists
      if (imageFile) {
        formData.set("image", imageFile);
        // } else if (location?.image) {
        //   // Keep the existing image if no new one is provided
        //   formData.set("image", "");
      }
      const plainData = Object.fromEntries(formData.entries());

      if (isEditing) {
        await updateLocation({ data: { id: location.id, form: plainData } });
        toast.success("Location updated", {
          description: "The location has been updated successfully.",
        });
        router.invalidate();
      } else {
        await createLocation({ data: plainData });
        toast.success("Location created", {
          description: "The location has been created successfully.",
        });
        router.invalidate();
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate({ to: "/admin/locations" });
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Error saving location", {
        description:
          error.message || "There was a problem saving the location.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={location?.name}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              name="city"
              defaultValue={location?.city}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            name="address"
            defaultValue={location?.address}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={location?.phone}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={location?.email || ""}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={location?.description || ""}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="opening_time">Opening Time *</Label>
            <Input
              id="opening_time"
              name="opening_time"
              type="time"
              defaultValue={location?.opening_time}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="closing_time">Closing Time *</Label>
            <Input
              id="closing_time"
              name="closing_time"
              type="time"
              defaultValue={location?.closing_time}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="google_maps_url">Google Maps URL</Label>
          <Input
            id="google_maps_url"
            name="google_maps_url"
            defaultValue={location?.google_maps_url || ""}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_open_on_weekends"
            name="is_open_on_weekends"
            value="true"
            defaultChecked={location?.is_open_on_weekends !== false}
          />
          <Label htmlFor="is_open_on_weekends">Open on weekends</Label>
        </div>

        <div className="space-y-2">
          <Label>Location Image</Label>
          <ImageUpload onChange={setImageFile} value={null} />
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
              navigate({ to: "/admin/locations" });
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
            ? "Update Location"
            : "Create Location"}
        </Button>
      </div>
    </form>
  );
}
