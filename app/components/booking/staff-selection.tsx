import { useBooking } from "./booking-provider";
import { useEffect, useState } from "react";
import { getAvailableStaff } from "@/actions/booking-actions";
import type { Staff } from "@/lib/type";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { User } from "lucide-react";

export function StaffSelection() {
  const { state, setStaff, setNoPreferenceStaff, nextStep, prevStep } =
    useBooking();
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStaff() {
      if (!state.location || !state.date) return;

      try {
        const data = await getAvailableStaff({
          data: {
            locationId: state.location.id,
            serviceIds: state.services.map((s) => s.id),
            date: state.date,
          },
        });
        console.log("Available staff members:", data);
        setStaffMembers(data);
      } catch (error) {
        console.error("Error loading staff:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStaff();
  }, [state.location, state.date, state.services]);

  const handleStaffSelect = (staff: Staff) => {
    setStaff(staff);
    setNoPreferenceStaff(false);
  };

  const handleNoPreference = () => {
    setNoPreferenceStaff(!state.isNoPreferenceStaff);
    if (!state.isNoPreferenceStaff) {
      setStaff(null);
    }
  };

  const handleNext = () => {
    if (state.staff || state.isNoPreferenceStaff) {
      nextStep();
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading staff members...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Select a Staff Member</h2>

        <div className="mb-6 bg-muted/30 p-4 rounded-lg border border-muted">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="no-preference"
              checked={state.isNoPreferenceStaff}
              onCheckedChange={handleNoPreference}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor="no-preference"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              No preference (We'll assign the best available staff)
            </label>
          </div>
        </div>

        {staffMembers.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {staffMembers.map((staff, index) => (
              <motion.div key={staff.id} variants={item}>
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                    state.staff?.id === staff.id
                      ? "border-primary ring-2 ring-primary ring-opacity-30 shadow-md"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => handleStaffSelect(staff)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-primary/10">
                        {staff.image ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/saibeauty/${staff.image}`}
                            alt={staff.name}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <User className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{staff.name}</h3>
                        <p className="text-sm text-primary">{staff.role}</p>
                        {staff.bio && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {staff.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg border border-muted">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">
              No staff members available
            </h3>
            <p className="text-muted-foreground">
              No staff members are available for the selected date.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!state.staff && !state.isNoPreferenceStaff}
          className="px-8 bg-primary hover:bg-primary/90"
          size="lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
