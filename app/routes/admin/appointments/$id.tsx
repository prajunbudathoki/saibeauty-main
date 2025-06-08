import { getAppointmentById } from "@/actions/admin-appointment-actions";
import { AppointmentDetail } from "@/components/appointment/appointment-detail";
import { AdminHeader } from "@/components/shared/admin-header";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/appointments/$id")({
	component: RouteComponent,
	loader: async ({ params }) => {
		return await getAppointmentById({ data: params.id });
	},
});

function RouteComponent() {
  const data = Route.useLoaderData()
  const appointment = data?.appointment
  const services = data?.services
	 return (
      <div>
        <AdminHeader title="Appointment Details" />

        <div className="container py-6">
          <div className="flex items-center gap-2 mb-6">
            <Button asChild variant="outline" size="icon" className="h-8 w-8">
              <Link to="/admin/appointments">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-lg font-medium">Appointment Details</h2>
          </div>

          <AppointmentDetail appointment={appointment} services={services} />
        </div>
      </div>
    )
}
