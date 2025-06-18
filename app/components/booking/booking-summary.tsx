import { createAppointment } from "@/actions/booking-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPrice } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { motion } from "motion/react";
import { Calendar, Check, Loader2, MapPin, Scissors, User } from "lucide-react";
import { useState } from "react";
import { useBooking } from "./booking-provider";
import { useNavigate, useRouter } from "@tanstack/react-router";

export function BookingSummary() {
  const { state, prevStep, reset } = useBooking();
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!termsAccepted || !state.location || !state.date || !state.timeSlot) {
      return;
    }

    setLoading(true);

    const services = state.services.map((service) => ({
      id: service.id,
      price: service.price || service.service?.price || 0,
      duration: service.service?.duration || 0,
    }));
    const formData = new FormData();
    formData.append("location_id", state.location.id);
    formData.append("staff_id", state.staff?.id || "");
    formData.append("start_time", state.timeSlot.startTime);
    formData.append("end_time", state.timeSlot.endTime);
    formData.append("customer_name", state.customerDetails.name);
    formData.append("customer_email", state.customerDetails.email);
    formData.append("customer_phone", state.customerDetails.phone);
    formData.append("customer_notes", state.customerDetails.notes || "");
    formData.append("total_price", state.totalPrice.toString());
    // Add services to FormData
    services.forEach((service, index) => {
      formData.append("serviceIds", service.id);
      formData.append("servicePrices", service.price.toString());
      formData.append(
        "serviceDurations",
        service.duration ? service.duration.toString() : ""
      );
    });
    console.log("formData after services", formData);

    // Call the server action with FormData
    const appointment = await createAppointment({ data: formData });

    // Redirect to confirmation page
    navigate({ to: `/profile/booking/confirmation?id=${appointment.id}` });
    // Reset booking state
    await router.invalidate();

    setLoading(false);
  };

  const formatDate = (isoString: string) => {
    return format(parseISO(isoString), "EEEE, MMMM d, yyyy");
  };

  const formatTime = (isoString: string) => {
    return format(parseISO(isoString), "h:mm a");
  };

  const summaryItems = [
    {
      title: "Location",
      icon: <MapPin className="h-5 w-5 text-primary" />,
      content: (
        <>
          <p className="font-medium">{state.location?.name}</p>
          <p className="text-sm text-gray-500">
            {state.location?.address}, {state.location?.city}
          </p>
        </>
      ),
    },
    {
      title: "Date & Time",
      icon: <Calendar className="h-5 w-5 text-primary" />,
      content: (
        <>
          <p className="font-medium">
            {state.date ? formatDate(state.date) : ""}
          </p>
          <p className="text-sm text-gray-500">
            {state.timeSlot
              ? `${formatTime(state.timeSlot.startTime)} - ${formatTime(
                  state.timeSlot.endTime
                )}`
              : ""}
          </p>
        </>
      ),
    },
    {
      title: "Staff",
      icon: <User className="h-5 w-5 text-primary" />,
      content: (
        <p className="font-medium">
          {state.staff?.name ||
            "No preference (We will assign the best available staff)"}
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>

        <Card className="border-primary/20 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 space-y-6">
              <motion.div
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {summaryItems.map((item, index) => (
                  <motion.div
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="flex items-start gap-3"
                  >
                    <div className="bg-primary/10 p-2 rounded-full">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">{item.title}</h3>
                      {item.content}
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="flex items-start gap-3"
                >
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Scissors className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-2">Services</h3>
                    <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                      {state.services.map((service) => (
                        <div key={service.id} className="flex justify-between">
                          <span>{service.service?.name}</span>
                          <span className="font-medium">
                            {formatPrice(
                              service.price || service.service?.price || 0
                            )}
                          </span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                        <span>Total</span>
                        <span className="text-primary">
                          {formatPrice(state.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="flex items-start gap-3"
                >
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">Your Details</h3>
                    <p className="font-medium">{state.customerDetails.name}</p>
                    <p className="text-sm text-gray-500">
                      {state.customerDetails.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {state.customerDetails.phone}
                    </p>
                    {state.customerDetails.notes && (
                      <div className="mt-2 bg-muted/30 p-3 rounded-lg">
                        <p className="text-sm font-medium">Notes:</p>
                        <p className="text-sm text-gray-500">
                          {state.customerDetails.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <div className="bg-muted/30 p-6 border-t border-muted">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) =>
                    setTermsAccepted(checked === true)
                  }
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions and cancellation policy
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || !termsAccepted}
          className="px-8 bg-primary hover:bg-primary/90"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Confirm Booking
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
