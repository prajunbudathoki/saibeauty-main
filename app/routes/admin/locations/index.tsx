import { getLocations } from "@/actions/location-actions";
import { LocationCard } from "@/components/location/location-card";
import { LocationDialog } from "@/components/location/location-dialog";
import { AdminHeader } from "@/components/shared/admin-header";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/admin/locations/")({
  component: RouteComponent,
  loader: async () => {
    return await getLocations();
  },
});

function RouteComponent() {
  const locations = Route.useLoaderData();
  try {
    return (
      <div>
        <AdminHeader title="Locations" />

        <div className="container py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">All Locations</h2>

            <LocationDialog
              title="Add Location"
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              }
            />
          </div>

          {locations.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No locations yet</h3>
              <p className="text-muted-foreground">
                Add your first location to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {locations.map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div>
        <AdminHeader title="Locations" />
        <div className="container py-6">
          <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
            <h3 className="text-lg font-medium text-red-800">
              Error loading locations
            </h3>
            <p className="text-red-600">
              There was a problem loading the locations. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
