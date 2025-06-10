import { motion } from "motion/react";
import { formatTime } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { LocationDialog } from "./location-dialog";
import {
  MapPin,
  Clock,
  Trash2,
  Edit,
  ExternalLink,
  Users,
  Scissors,
} from "lucide-react";
import { deleteLocation } from "@/actions/location-actions";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

export function LocationCard({ location }) {
  const handleDelete = async () => {
    try {
      await deleteLocation({ data: location.id });
      toast.success("Location deleted successfully");
    } catch (error) {
      toast.error("Failed to delete the location");
    }
  };

  const imageUrl = null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col border border-border/50 hover:border-border hover:shadow-md transition-all duration-300">
        <div className="relative h-48 overflow-hidden group">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={location.name}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg">{location.name}</h3>
          </div>
        </CardHeader>
        <CardContent className="pb-2 flex-1">
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <div>{location.address}</div>
                <div>{location.city}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                {formatTime(location.opening_time)} -{" "}
                {formatTime(location.closing_time)}
                {location.is_open_on_weekends
                  ? ", Open weekends"
                  : ", Closed weekends"}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2 border-t">
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hover:bg-primary/10 hover:text-primary"
            >
              <Link
                to="/admin/locations/$id/services"
                params={{ id: location.id }}
              >
                <Scissors className="h-4 w-4 mr-1" />
                Services
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="hover:bg-primary/10 hover:text-primary"
            >
              <Link
                to="/admin/locations/$id/staffs/schedule"
                params={{ id: location.id }}
              >
                <Users className="h-4 w-4 mr-1" />
                Staff
              </Link>
            </Button>

            {location.google_maps_url && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hover:bg-primary/10 hover:text-primary"
              >
                <a
                  href={location.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Map
                </a>
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <LocationDialog
              location={location}
              title="Edit Location"
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />

            <ConfirmDialog
              title="Delete Location"
              description="Are you sure you want to delete this location? This action cannot be undone."
              onConfirm={handleDelete}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
