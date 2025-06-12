import { useBooking } from "./booking-provider";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export function BookingSteps() {
  const { state, goToStep } = useBooking();
  const { step } = state;

  const steps = [
    { id: 1, name: "Location & Date" },
    { id: 2, name: "Services" },
    { id: 3, name: "Staff" },
    { id: 4, name: "Time" },
    { id: 5, name: "Details" },
    { id: 6, name: "Confirm" },
  ];

  return (
    <div className="w-full py-8 px-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl mb-8">
      <div className="relative flex justify-between items-center">
        {/* Progress bar background */}
        <div className="absolute h-1 bg-gray-200 left-0 right-0 top-1/2 -translate-y-1/2 hidden sm:block" />

        {/* Active progress bar */}
        <div
          className="absolute h-1 bg-primary left-0 top-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out hidden sm:block"
          style={{
            width: `${(Math.max(1, step - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((s, i) => (
          <div key={s.id} className="flex flex-col items-center z-10">
            <button
              onClick={() => {
                // Only allow going back to previous steps
                if (s.id < step) {
                  goToStep(s.id);
                }
              }}
              type="button"
              className={cn(
                "relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300",
                step > s.id
                  ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : step === s.id
                  ? "border-primary text-primary bg-white shadow-lg shadow-primary/20"
                  : "border-gray-300 text-gray-400 bg-white"
              )}
              disabled={s.id >= step}
            >
              {step > s.id ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle2 className="w-6 h-6" />
                </motion.div>
              ) : (
                <span className="text-lg font-medium">{s.id}</span>
              )}

              {step === s.id && (
                <motion.div
                  className="absolute -inset-1 rounded-full border-2 border-primary"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
              )}
            </button>
            <span
              className={cn(
                "text-sm mt-2 font-medium transition-colors duration-300",
                step >= s.id ? "text-primary" : "text-gray-400"
              )}
            >
              {s.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
