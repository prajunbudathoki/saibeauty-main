import { getLocationById } from "@/actions/location-actions";
import { getStaffById } from "@/actions/staff-actions";
import { getStaffSchedules } from "@/actions/staff-schedule-actions";
import { AdminHeader } from "@/components/shared/admin-header";
import { AvailabilityCalendar } from "@/components/staff/schedule/availability-calendar";
import { WeeklyScheduleForm } from "@/components/staff/schedule/weekly-schedule-form";
import { WeeklyScheduleList } from "@/components/staff/schedule/weekly-schedule-list";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute(
  "/admin/locations/$id/staffs/$staffid/schedules"
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    const [staff, schedules, location] = await Promise.all([
      getStaffById({ data: params.staffid }),
      getStaffSchedules({
        data: { staffId: params.staffid, locationId: params.id },
      }),
      getLocationById({ data: params.id }),
    ]);
    return { staff, schedules, location };
  },
});

function RouteComponent() {
  const { staff, schedules, location } = Route.useLoaderData();
  const existingDays = Array.isArray(schedules)
    ? schedules.map((schedule) => schedule.day_of_week)
    : [];
  return (
    <div>
      <AdminHeader title={`${staff.name} - Schedules`} />

      <div className="container py-6">
        <div className="flex items-center gap-2 mb-6">
          <Button asChild variant="outline" size="icon" className="h-8 w-8">
            <Link
              to="/admin/locations/$id/staffs"
              params={{ id: staff.location_id }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-lg font-medium">
            Manage Schedules for {staff.name} at {location?.name}
          </h2>
        </div>

        <Tabs defaultValue="weekly" className="space-y-6">
          <TabsList>
            <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
            <TabsTrigger value="special">Special Availability</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-6">
            <WeeklyScheduleForm
              staffId={staff.id}
              locationId={location?.id ?? ""}
              existingDays={existingDays}
            />

            <WeeklyScheduleList
              schedules={schedules}
              staffId={staff.id}
              locationId={location?.id}
            />
          </TabsContent>

          <TabsContent value="special">
            <AvailabilityCalendar
              staffId={staff.id}
              locationId={location?.id}
              weeklySchedules={schedules}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
