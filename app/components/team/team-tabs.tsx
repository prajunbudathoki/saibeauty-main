import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStaffsByLocation } from "@/actions/staff-actions";
import { TeamStaffCard } from "@/components/team/team-staff-card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import type { Location, Staff } from "@/generated/prisma";

interface TeamTabsProps {
  locations: Location[];
}

export function TeamTabs({ locations }: TeamTabsProps) {
  const [activeLocation, setActiveLocation] = useState<string>(
    locations[0]?.id || ""
  );
  const [staffByLocation, setStaffByLocation] = useState<
    Record<string, Staff[]>
  >({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Initialize loading state for all locations
    const initialLoadingState: Record<string, boolean> = {};
    locations.forEach((location) => {
      initialLoadingState[location.id] = true;
    });
    setLoading(initialLoadingState);

    // Load staff for the first location immediately
    if (locations.length > 0) {
      loadStaffForLocation(locations[0].id);
    }
  }, [locations]);

  const loadStaffForLocation = async (locationId: string) => {
    if (staffByLocation[locationId]) {
      return; // Already loaded
    }

    try {
      setLoading((prev) => ({ ...prev, [locationId]: true }));
      const staff = await getStaffsByLocation({ data: locationId });
      setStaffByLocation((prev) => ({ ...prev, [locationId]: staff }));
    } catch (error) {
      console.error(`Error loading staff for location ${locationId}:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [locationId]: false }));
    }
  };

  const handleTabChange = (locationId: string) => {
    setActiveLocation(locationId);
    loadStaffForLocation(locationId);
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
          {locations.map((location) => (
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
            <StaffGridSkeleton />
          ) : staffByLocation[location.id]?.length ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {staffByLocation[location.id].map((staff, index) => (
                <TeamStaffCard key={staff.id} staff={staff} index={index} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-2">
                No Team Members Found
              </h3>
              <p className="text-muted-foreground">
                We're currently updating our team information for this location.
                Please check back soon!
              </p>
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}

function StaffGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-80" />
      ))}
    </div>
  );
}
