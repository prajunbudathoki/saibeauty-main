import { useBooking } from "./booking-provider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import type { CustomerDetails } from "@/lib/type";
import { motion } from "motion/react";
import { User, Mail, Phone, MessageSquare } from "lucide-react";

export function CustomerForm() {
  const { state, setCustomerDetails, nextStep, prevStep } = useBooking();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerDetails>({
    defaultValues: state.customerDetails,
  });

  const onSubmit = (data: CustomerDetails) => {
    setLoading(true);
    setCustomerDetails(data);
    setLoading(false);
    nextStep();
  };

  const formFields = [
    {
      id: "name",
      label: "Full Name",
      placeholder: "Enter your full name",
      disabled: true,
      required: "Name is required",
      icon: <User className="h-4 w-4 text-muted-foreground" />,
    },
    {
      id: "email",
      disabled: true,
      label: "Email Address",
      placeholder: "Enter your email address",
      type: "email",
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
      icon: <Mail className="h-4 w-4 text-muted-foreground" />,
    },
    {
      id: "phone",
      label: "Phone Number",
      placeholder: "Enter your phone number",
      required: "Phone number is required",
      icon: <Phone className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Your Details</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <motion.div
            className="space-y-5"
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
            {formFields.map((field, index) => (
              <motion.div
                key={field.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="space-y-2"
              >
                <Label htmlFor={field.id} className="text-sm font-medium">
                  {field.label} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {field.icon}
                  </div>
                  <Input
                    id={field.id}
                    type={field.type || "text"}
                    className="pl-10 border-primary/20 focus-visible:ring-primary"
                    placeholder={field.placeholder}
                    {...register(field.id as keyof CustomerDetails, {
                      required: field.required,
                      pattern: field.pattern,
                    })}
                  />
                </div>
                {errors[field.id as keyof CustomerDetails] && (
                  <p className="text-sm text-red-500">
                    {errors[field.id as keyof CustomerDetails]?.message}
                  </p>
                )}
              </motion.div>
            ))}

            <motion.div
              className="space-y-2"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Label htmlFor="notes" className="text-sm font-medium">
                Additional Notes
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-3">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </div>
                <Textarea
                  id="notes"
                  className="pl-10 border-primary/20 focus-visible:ring-primary"
                  placeholder="Any special requests or information we should know"
                  rows={4}
                  {...register("notes")}
                />
              </div>
            </motion.div>
          </motion.div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-8 bg-primary hover:bg-primary/90"
              size="lg"
            >
              {loading ? "Saving..." : "Next"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
