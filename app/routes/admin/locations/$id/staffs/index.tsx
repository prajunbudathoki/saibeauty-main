import { getLocationById } from "@/actions/location-actions";
import { getStaffsByLocation } from "@/actions/staff-actions";
import { AdminHeader } from "@/components/shared/admin-header";
import { StaffCard } from "@/components/staff/staff-card";
import { StaffDialog } from "@/components/staff/staff-dialog";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Plus, Users } from "lucide-react";

export const Route = createFileRoute("/admin/locations/$id/staffs/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const staffs = await getStaffsByLocation({ data: params.id });

    return staffs;
  },
});

function RouteComponent() {
  const  staffs  = Route.useLoaderData();
  const {location} = Route.useRouteContext()
 
  return (
    <div>
      <AdminHeader title={`${location.name} - Staff`} />

      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="icon" className="h-8 w-8">
              <Link to="/admin/locations">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-lg font-medium">Staff for {location.name}</h2>
          </div>

          <StaffDialog
            locationId={location.id}
            title="Add Staff Member"
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            }
          />
        </div>

        {staffs.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No staff members yet</h3>
            <p className="text-muted-foreground">
              Add staff members to this location to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {staffs.map((staff) => (
              <StaffCard
                key={staff.id}
                staff={staff}
                locationId={location.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
