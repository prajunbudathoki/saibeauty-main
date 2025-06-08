import { motion } from "motion/react";
import { formatPrice } from "@/lib/utils";
import type { LocationService } from "@/lib/type";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { LocationServiceDialog } from "./location-service-dialog";
import { Trash2, Edit, Clock, Tag } from "lucide-react";
import { removeServiceFromLocation } from "@/actions/location-service-actions";
import { toast } from "sonner";

interface LocationServiceCardProps {
  locationService: LocationService;
  locationId: string;
}

export function LocationServiceCard({
  locationService,
  locationId,
}: LocationServiceCardProps) {
  const handleDelete = async () => {
    try {
      await removeServiceFromLocation({ data: locationService.id });
      toast.success("Service removed from location successfully");
    } catch (error) {
      toast.error("Failed to remove service from location");
    }
  };

  const service = locationService.service;
  if (!service) return null;

  const imageUrl = "";

  const price =
    locationService.price !== null ? locationService.price : service.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden flex flex-row h-32">
        <div className="relative w-32">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={service.name}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col flex-1">
          <CardContent className="p-4 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{service.name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Tag className="h-3 w-3" />
                  <span>{service.category?.name || "Uncategorized"}</span>

                  {service.duration && (
                    <>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{service.duration} min</span>
                    </>
                  )}
                </div>
              </div>
              <span className="font-medium text-primary-foreground bg-primary px-2 py-1 rounded-md text-sm">
                {formatPrice(price)}
              </span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-end">
            <div className="flex gap-2">
              <LocationServiceDialog
                locationId={locationId}
                locationService={locationService}
                title="Update Service Price"
                trigger={
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                }
              />

              <ConfirmDialog
                title="Remove Service"
                description="Are you sure you want to remove this service from this location? This action cannot be undone."
                onConfirm={handleDelete}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                }
              />
            </div>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
}
