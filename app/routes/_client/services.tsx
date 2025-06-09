import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { LocationService } from "@/lib/type";
import { formatPrice } from "@/lib/utils";
import { motion } from "motion/react";
import { Clock, Star } from "lucide-react";

interface ClientServiceCardProps {
  locationService: LocationService;
  index?: number;
}

export const Route = createFileRoute("/_client/services")({
  component: RouteComponent,
});

function RouteComponent({
  locationService,
  index = 0,
}: ClientServiceCardProps) {
  const { service } = locationService;
  if (!service) return null;

  const imageUrl = "https://picsum.photos/id/237/200/300";

  const price =
    locationService.price !== null ? locationService.price : service.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-all duration-300 group border-primary/10 hover:border-primary/30">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={service.name}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* {service.category?.name && (
            <div className="absolute top-3 left-3 bg-primary/80 text-primary-foreground text-xs font-medium py-1 px-2 rounded-full">
              {service.category.name}
            </div>
          )} */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-16" />
        </div>
        <CardHeader className="pb-2 pt-4">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
              {service.name}
            </h3>
          </div>
        </CardHeader>
        <CardContent className="pb-2 flex-1">
          {service.description && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {service.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3 items-center">
            {(locationService.duration || service.duration) && (
              <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
                <Clock className="h-3 w-3 text-primary" />
                <span>{locationService.duration || service.duration} min</span>
              </div>
            )}
            <div className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              <Star className="h-3 w-3 fill-current" />
              <span>{formatPrice(price)}</span>
            </div>
          </div>
        </CardContent>
        {/* <CardFooter className="pt-2 border-t">
          <Link href="/profile/booking" className="w-full">
            <Button className="w-full bg-primary hover:bg-primary/90 transition-colors">Book Now</Button>
          </Link>
        </CardFooter> */}
      </Card>
    </motion.div>
  );
}
