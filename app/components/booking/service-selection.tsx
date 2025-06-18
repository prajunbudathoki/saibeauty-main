import { getLocationServices } from "@/actions/booking-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LocationService } from "@/lib/type";
import { motion } from "motion/react";
import { Check, Loader2, Scissors, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useBooking } from "./booking-provider";
import { formatPrice } from "@/lib/utils";

export function ServiceSelection() {
  const { state, addService, removeService, nextStep, prevStep } = useBooking();
  const [services, setServices] = useState<LocationService[]>([]);
  const [loading, setLoading] = useState(true);
  // Update the useEffect hook and categories state to properly handle unique categories and add an "All" category
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    async function loadServices() {
      if (!state.location) return;

      try {
        const data = await getLocationServices({ data: state.location.id });
        setServices(data);

        const uniqueCategoriesMap = new Map<
          string,
          { id: string; name: string }
        >();

        // Add each category only once
        data.forEach((item) => {
          const category = item.service?.category;
          if (category && !uniqueCategoriesMap.has(category.id)) {
            uniqueCategoriesMap.set(category.id, {
              id: category.id,
              name: category.name,
            });
          }
        });

        // Convert map to array and add "All" category at the beginning
        const uniqueCategories = Array.from(uniqueCategoriesMap.values());
        setCategories([...uniqueCategories]);

        setActiveCategory(uniqueCategories[0]?.id);
      } catch (error) {
        console.error("Error loading services:", error);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, [state.location]);

  const isServiceSelected = (serviceId: string) => {
    return state.services.some((s) => s.id === serviceId);
  };

  const handleServiceToggle = (service: LocationService) => {
    if (isServiceSelected(service.id)) {
      removeService(service.id);
    } else {
      addService(service);
    }
  };

  const handleNext = () => {
    if (state.services.length > 0) {
      nextStep();
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Select Services</h2>

        {categories.length > 0 ? (
          <Tabs
            defaultValue={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full"
          >
            <ScrollArea>
              <TabsList className="mb-6 bg-muted/50 p-1 h-12 ">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="h-10 data-[state=active]:bg-white"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {services
                    .filter((item) => {
                      // For "all" category, show all services
                      if (category.id === "all") return true;
                      // Otherwise, filter by category
                      return item.service?.category_id === category.id;
                    })
                    // Create a Set to track service IDs we've already rendered
                    .filter((item, index, self) => {
                      // Only keep the first occurrence of each service ID
                      return (
                        self.findIndex(
                          (s) => s.service?.id === item.service?.id
                        ) === index
                      );
                    })
                    .map((service) => (
                      <motion.div key={service.id} variants={item}>
                        <Card
                          className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                            isServiceSelected(service.id)
                              ? "border-primary ring-2 ring-primary ring-opacity-30 shadow-md"
                              : "hover:border-gray-300"
                          }`}
                          onClick={() => handleServiceToggle(service)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-primary/10">
                                {service.service?.image ? (
                                  <img
                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/saibeauty/${service.service.image}`}
                                    alt={service.service.name}
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Scissors className="h-6 w-6" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <h3 className="font-medium">
                                    {service.service?.name}
                                  </h3>
                                  <div className="flex items-center">
                                    {isServiceSelected(service.id) ? (
                                      <Check className="w-5 h-5 text-primary" />
                                    ) : null}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                  {service.service?.description ||
                                    "No description available"}
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                  <p className="font-medium text-primary">
                                    {formatPrice(
                                      service.price ||
                                        service.service?.price ||
                                        0
                                    )}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {service.service?.duration} min
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg border border-muted">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scissors className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No services available</h3>
            <p className="text-muted-foreground">
              No services available for this location.
            </p>
          </div>
        )}
      </div>

      {state.services.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-muted/30 p-5 rounded-lg border border-muted"
        >
          <h3 className="font-medium mb-3">Selected Services</h3>
          <div className="space-y-3">
            {state.services.map((service) => (
              <div
                key={service.id}
                className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm"
              >
                <div className="flex items-center">
                  <span className="font-medium">{service.service?.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({service.service?.duration} min)
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-4 text-primary">
                    {formatPrice(service.price || service.service?.price || 0)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeService(service.id);
                    }}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="border-t pt-3 mt-3 flex justify-between font-medium">
              <span>Total</span>
              <span className="text-primary">
                {formatPrice(state.totalPrice)} ({state.totalDuration} min)
              </span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={state.services.length === 0}
          className="px-8 bg-primary hover:bg-primary/90"
          size="lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
