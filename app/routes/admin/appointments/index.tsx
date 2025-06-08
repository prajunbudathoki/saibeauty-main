import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/shared/admin-header";
import { AppointmentListWithFilters } from "@/components/appointment/appointment-list-with-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { getLocations } from "@/actions/location-actions";

export const Route = createFileRoute("/admin/appointments/")({
  loader: async () => {
    try {
      const locations = await getLocations();
      return { locations };
    } catch (error) {
      return { error: true };
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { locations, error } = Route.useLoaderData();

  if (error) {
    return (
      <div>
        <AdminHeader title="Appointments" />
        <div className="container py-6">
          <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
            <h3 className="text-lg font-medium text-red-800">Error loading appointments</h3>
            <p className="text-red-600">There was a problem loading the appointments. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!locations) {
    return <AppointmentsLoading />;
  }

  return (
    <div>
      <AdminHeader title="Appointments" />
      <div className="container py-6">
        <AppointmentListWithFilters locations={locations} />
      </div>
    </div>
  );
}

function AppointmentsLoading() {
  return (
    <div>
      <AdminHeader title="Appointments" />
      <div className="container py-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-full max-w-4xl mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    </div>
  );
}
