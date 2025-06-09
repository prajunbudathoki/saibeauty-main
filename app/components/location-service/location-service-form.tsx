import {
	addServiceToLocation,
	getAvailableServices,
	updateLocationService,
} from "@/actions/location-service-actions";
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
import { formatPrice } from "@/lib/utils";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function LocationServiceForm({
  locationId,
  locationService,
  onSuccess,
  categories,
}) {
  const [loading, setLoading] = useState(false);
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categories?.find(
      (category) => category.id === locationService?.service?.category_id
    )?.id || null
  );

  const isEditing = !!locationService;

  useEffect(() => {
    if (!isEditing && selectedCategory) {
      const fetchAvailableServices = async () => {
        try {
          const data = await getAvailableServices({ data: locationId });
          setAvailableServices(data);
        } catch (error) {
          console.error("Error fetching available services:", error);
          toast.error("Failed to load available services");
        }
      };

      fetchAvailableServices();
    }
  }, [locationId, isEditing, selectedCategory]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("location_id", locationId);

      if (isEditing) {
        await updateLocationService({ data: locationService.id });
        toast.success("Service price updated successfully");
      } else {
        await addServiceToLocation({ data: formData });
        toast.success("Service added to location successfully");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "There was a problem saving the service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {!isEditing && (
          <div className="space-y-2">
            <Label htmlFor="category_id">Category *</Label>
            <Select
              defaultValue={selectedCategory || undefined}
              name="category_id"
              onValueChange={(value) => {
                setSelectedCategory(value);
                setAvailableServices([]);
              }}
              required
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {!isEditing ? (
          <div className="space-y-2">
            <Label htmlFor="service_id">Service *</Label>
            <Select name="service_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {availableServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - {service.category?.name} [
                    {formatPrice(service.price)}]
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div>
            <Label>Service</Label>
            <div className="p-2 border rounded-md bg-muted/50">
              {locationService.service?.name}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="price">
            Price ($){" "}
            {isEditing ? "*" : "(Optional - uses default price if empty)"}
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={locationService?.price || ""}
            required={isEditing}
            placeholder={!isEditing ? "Uses default price if empty" : undefined}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEditing ? "Update Price" : "Add Service"}
        </Button>
      </div>
    </form>
  );
}
