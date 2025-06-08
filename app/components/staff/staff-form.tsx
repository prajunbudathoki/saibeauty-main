"use client";

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
import { useNavigate } from "@tanstack/react-router";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("location_id", locationId);

      // Add the image file if it exists
      if (imageFile) {
        formData.set("image", imageFile);
      } else if (staff?.image) {
        // Keep the existing image if no new one is provided
        formData.set("image", "");
      }

      if (isEditing) {
        await updateStaff({ data: staff.id });
        toast.success("Staff member updated successfully");
      } else {
        await createStaff({ data: formData });
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" defaultValue={staff?.name} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Input
            id="role"
            name="role"
            defaultValue={staff?.role}
            placeholder="e.g. Hair Stylist, Makeup Artist"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={staff?.bio || ""}
            placeholder="Brief description or biography"
          />
        </div>

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

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_available_for_booking"
            name="is_available_for_booking"
            value="true"
            defaultChecked={staff?.is_available_for_booking !== false}
          />
          <Label htmlFor="is_available_for_booking">
            Available for booking
          </Label>
        </div>

        <div className="space-y-2">
          <Label>Profile Image</Label>
          <ImageUpload
            onChange={setImageFile}
            value={
              staff?.image
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/saibeauty/${staff.image}`
                : null
            }
          />
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
            if (onSuccess) {
              onSuccess();
            } else {
              navigate({ to: `/admin/locations/${locationId}/staffs` });
            }
          }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEditing ? "Update Staff" : "Add Staff"}
        </Button>
      </div>
    </form>
  );
}
