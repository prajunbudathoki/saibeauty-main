import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BookingProvider,
  useBooking,
} from "@/components/booking/booking-provider";
import { BookingSteps } from "@/components/booking/booking-steps";
import { LocationDateSelection } from "@/components/booking/location-date-selection";
import { ServiceSelection } from "@/components/booking/service-selection";
import { StaffSelection } from "@/components/booking/staff-selection";
import { TimeSlotSelection } from "@/components/booking/time-slot-selection";
import { CustomerForm } from "@/components/booking/customer-form";
import { BookingSummary } from "@/components/booking/booking-summary";
import { motion } from "motion/react";
import { useSession } from "@/lib/auth-client";
import { Navigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_client/profile/booking/")({
  component: () => (
    <BookingProvider>
      <RouteComponent />
    </BookingProvider>
  ),
});

function RouteComponent() {
  const { state } = useBooking();
  const { data: session } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session?.user) {
      navigate({ to: "/auth/login" });
    }
  }, [session, navigate]);

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Book an Appointment
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Schedule your beauty services in just a few simple steps
        </p>
      </motion.div>

      <BookingSteps />

      <motion.div
        key={state.step}
        initial="hidden"
        animate="visible"
        className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-muted"
      >
        {state.step === 1 && <LocationDateSelection />}
        {state.step === 2 && <ServiceSelection />}
        {state.step === 3 && <StaffSelection />}
        {state.step === 4 && <TimeSlotSelection />}
        {state.step === 5 && <CustomerForm />}
        {state.step === 6 && <BookingSummary />}
      </motion.div>
    </div>
  );
}
