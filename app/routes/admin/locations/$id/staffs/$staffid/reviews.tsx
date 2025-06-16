import { getStaffById } from "@/actions/staff-actions";
import { AdminHeader } from "@/components/shared/admin-header";
import { StaffReviews } from "@/components/staff/staff-reviews";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/locations/$id/staffs/$staffid/reviews")({
  loader: async ({ params }) => {
    try {
      const staff = await getStaffById({ data: params.id});
      return { staff, locationId: params.id, staffId: params.id};
    } catch (error) {
      throw new Error("Staff not found");
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { staff, locationId, staffId } = Route.useLoaderData();

  return (
    <div>
      <AdminHeader title={`${staff.name}'s Reviews`} />

      <div className="container py-6">
        <div className="flex items-center gap-2 mb-6">
          <Button asChild variant="outline" size="icon" className="h-8 w-8">
            <Link to="/admin/locations/$id/staffs" params={{ id: locationId }}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-lg font-medium">{staff.name}'s Reviews</h2>
        </div>

        <StaffReviews staffId={staffId} />
      </div>
    </div>
  );
}
