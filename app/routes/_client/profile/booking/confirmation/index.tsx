import { createFileRoute, Link } from "@tanstack/react-router";
import { getAppointmentDetails } from "@/actions/appointments-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { motion } from "motion/react";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Loader2,
  MapPin,
  Scissors,
  User,
} from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({
  id: z.string(),
});

export const Route = createFileRoute("/_client/profile/booking/confirmation/")({
  validateSearch: searchSchema,
  component: RouteComponent,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const appointmentId = deps.id;
    console.log("Loading appointment details for ID:", appointmentId);
    if (!appointmentId) {
      return { error: "No appointment ID provided" };
    }
    try {
      const result = await getAppointmentDetails({ data: appointmentId });
      if ("error" in result) {
        return { error: result.error || "Failed to load appointment details" };
      }
      return {
        appointment: result.appointment,
        location: result.location,
        staff: result.staff,
        services: result.services,
      };
    } catch (err) {
      return { error: "Failed to load appointment details" };
    }
  },
});

function RouteComponent() {
  const { appointment, staff, location, services, error } =
    Route.useLoaderData();
  const loading = !appointment && !error;

  const formatDate = (date: string | Date) =>
    format(
      typeof date === "string" ? parseISO(date) : date,
      "EEEE, MMMM d, yyyy"
    );
  const formatTime = (date: string | Date) =>
    format(typeof date === "string" ? parseISO(date) : date, "h:mm a");

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-16 px-4 flex flex-col justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your booking details...</p>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="container max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Appointment Not Found</h1>
        <p className="mb-8 text-muted-foreground">
          {error || "We couldn't find the appointment you're looking for."}
        </p>
        <Link to="/profile/booking">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Book a New Appointment
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Booking Confirmed!</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Your appointment has been successfully booked. We've sent a
          confirmation email to{" "}
          <span className="font-medium">{appointment.customer_email}</span>.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-8 border-primary/20 overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Date & Time</h3>
                <p className="font-medium">
                  {formatDate(appointment.start_time)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatTime(appointment.start_time)} -{" "}
                  {formatTime(appointment.end_time)}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Location</h3>
                {location ? (
                  <>
                    <p className="font-medium">{location.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {location.address}, {location.city}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Location details not available
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Staff</h3>
                {staff ? (
                  <p className="font-medium">{staff.name}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Staff will be assigned
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Scissors className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg mb-2">Services</h3>
                <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                  {services.map((service) => (
                    <div key={service.id} className="flex justify-between">
                      <span>{service.locationService?.service?.name}</span>
                      <span className="font-medium">
                        {formatPrice(service.price)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatPrice(appointment.total_price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-lg">Need to make changes to your appointment?</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/contact">
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </Link>
          <Link to="/profile/my-bookings">
            <Button variant="outline" size="lg">
              View My Bookings
            </Button>
          </Link>
          <Link to="/">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Return to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
