import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLocationServices } from "@/actions/location-service-actions";
import { ClientServiceCard } from "@/components/services/client-service-card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatPrice } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { min } from "date-fns";

function minToHourMinute(duration: number): string {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
}

export function ServicesTabs({ locations }) {
  const [activeLocation, setActiveLocation] = useState<string>(
    locations[0]?.id || ""
  );
  const [servicesByLocation, setServicesByLocation] = useState({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [categories, setCategories] = useState<Record<string, string[]>>({});

  useEffect(() => {
    // Initialize loading state for all locations
    const initialLoadingState: Record<string, boolean> = {};
    for (const location of locations) {
      initialLoadingState[location.id] = true;
    }
    setLoading(initialLoadingState);

    // Load services for the first location immediately
    if (locations.length > 0) {
      loadServicesForLocation(locations[0].id);
    }
  }, [locations]);

  const loadServicesForLocation = async (locationId: string) => {
    if (servicesByLocation[locationId]) {
      return; // Already loaded
    }

    try {
      setLoading((prev) => ({ ...prev, [locationId]: true }));
      const services = await getLocationServices({ data: locationId });
      const normalizedServices = services.map((service: any) => ({
        ...service,
        duration: service.duration ?? service.service?.duration ?? "",
      }));
      setServicesByLocation((prev) => ({
        ...prev,
        [locationId]: normalizedServices,
      }));

      const uniqueCategories = Array.from(
        new Set(
          normalizedServices
            .map((service) => service.service?.category?.name)
            .filter(Boolean)
        )
      ) as string[];

      setCategories((prev) => ({ ...prev, [locationId]: uniqueCategories }));
    } catch (error) {
      console.error(
        `Error loading services for location ${locationId}:`,
        error
      );
    } finally {
      setLoading((prev) => ({ ...prev, [locationId]: false }));
    }
  };

  const handleTabChange = (locationId: string) => {
    setActiveLocation(locationId);
    loadServicesForLocation(locationId);
  };

  if (locations.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg p-8">
        <h3 className="text-xl font-semibold mb-2">No Locations Found</h3>
        <p className="text-muted-foreground">
          We're currently setting up our locations. Please check back soon!
        </p>
      </div>
    );
  }

  return (
    <Tabs
      defaultValue={activeLocation}
      onValueChange={handleTabChange}
      className="w-full"
    >
      <div className="mb-8 border-b">
        <TabsList className="h-auto p-0 bg-transparent flex flex-nowrap overflow-x-auto">
          {locations.map((location: any) => (
            <TabsTrigger
              key={location.id}
              value={location.id}
              className="text-base py-3 px-5 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              {location.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {locations.map((location) => (
        <TabsContent key={location.id} value={location.id} className="mt-0">
          {loading[location.id] ? (
            <ServicesGridSkeleton />
          ) : servicesByLocation[location.id]?.length ? (
            <div>
              {categories[location.id]?.length > 0 && (
                <div className="mb-12">
                  <Tabs
                    defaultValue={categories[location.id][0]}
                    className="w-full"
                  >
                    <ScrollArea type="always">
                      <TabsList className="h-auto p-0 bg-transparent flex flex-nowrap pb-2 ">
                        {categories[location.id].map((category) => (
                          <TabsTrigger
                            key={category}
                            value={category}
                            className="text-base py-3 px-5 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                          >
                            {category}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      <ScrollBar
                        orientation="horizontal"
                        className="h-2 mt-2"
                      />
                    </ScrollArea>
                    {categories[location.id].map((category) => {
                      const categoryServices = servicesByLocation[
                        location.id
                      ].filter(
                        (service) =>
                          service.service?.category?.name === category
                      );

                      if (categoryServices.length === 0) return null;

                      return (
                        <TabsContent key={category} value={category}>
                          <motion.h2
                            className="text-2xl mt-10 font-semibold mb-6 pb-2 border-b"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {category}
                          </motion.h2>
                          <div className="rounded border">
                            <Table className="w-full text-lg">
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Service</TableHead>
                                  <TableHead>Duration</TableHead>
                                  <TableHead>Price</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {categoryServices.map((locationService) => {
                                  return (
                                    <TableRow
                                      key={locationService.id}
                                      className="text-md"
                                    >
                                      <TableCell className="w-[60%]">
                                        {locationService.service?.name}
                                      </TableCell>
                                      <TableCell className="w-[20%]">
                                        {locationService.duration ||
                                          locationService.service
                                            ?.duration}{" "}
                                        min
                                        {minToHourMinute(
                                          locationService.duration || 0
                                        )}
                                      </TableCell>
                                      <TableCell className="w-[20%]">
                                        {locationService.price !== null
                                          ? `${formatPrice(
                                              locationService.price
                                            )}`
                                          : `${formatPrice(
                                              locationService.service?.price
                                            )}`}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        </TabsContent>
                      );
                    })}
                  </Tabs>
                </div>
              )}

              {/* For services without categories */}
              {servicesByLocation[location.id].some(
                (service) => !service.service?.category?.name
              ) && (
                <div>
                  <motion.h2
                    className="text-2xl font-semibold mb-6 pb-2 border-b"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    Other Services
                  </motion.h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {servicesByLocation[location.id]
                      .filter((service) => !service.service?.category?.name)
                      .map((locationService, index) => (
                        <ClientServiceCard
                          key={locationService.id}
                          locationService={locationService}
                          index={index}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-2">No Services Found</h3>
              <p className="text-muted-foreground">
                We're currently updating our service list for this location.
                Please check back soon!
              </p>
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}

function ServicesGridSkeleton() {
  return (
    <div>
      <Skeleton className="h-10 w-48 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    </div>
  );
}
