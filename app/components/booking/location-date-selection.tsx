import { useBooking } from "./booking-provider";
import { useEffect, useState } from "react";
import { getLocations } from "@/actions/booking-actions";
import type { Location } from "@/lib/type";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { addDays, startOfDay } from "date-fns";
import { Loader2, MapPin, Clock } from "lucide-react";
import { motion } from "motion/react";

export function LocationDateSelection() {
  const { state, dispatch, nextStep } = useBooking();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    state.date ? new Date(state.date) : undefined
  );

  useEffect(() => {
    async function loadLocations() {
      try {
        const data = await getLocations();
        setLocations(data);
      } catch (error) {
        console.error("Error loading locations:", error);
      } finally {
        setLoading(false);
      }
    }

    loadLocations();
  }, []);

  const handleLocationSelect = (location: Location) => {
    dispatch({ type: "SET_LOCATION", payload: location });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      dispatch({ type: "SET_DATE", payload: date.toISOString() });
    }
  };

  const handleNext = () => {
    if (state.location && state.date) {
      nextStep();
    }
  };

  // Disable past dates and dates more than 3 months in the future
  const disabledDays = {
    before: startOfDay(new Date()),
    after: addDays(new Date(), 90),
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
        <p className="text-muted-foreground">Loading locations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Select a Location</h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2  gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {locations.map((location) => (
            <motion.div key={location.id} variants={item}>
              <Card
                className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                  state.location?.id === location.id
                    ? "border-primary ring-2 ring-primary ring-opacity-30 shadow-md"
                    : "hover:border-gray-300"
                }`}
                onClick={() => handleLocationSelect(location)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded overflow-hidden bg-gray-100 border-2 border-primary/10">
                      {location.image ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/saibeauty/${location.image}`}
                          alt={location.name}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{location.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-primary" />
                        {location.address}, {location.city}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1 text-primary/70" />
                        {location.opening_time} - {location.closing_time}
                        {location.is_open_on_weekends
                          ? " (Open weekends)"
                          : " (Closed weekends)"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {state.location && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6">Select a Date</h2>
          <div className="flex justify-center">
            <Card className="border-primary/20 p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={disabledDays}
                className="rounded-md"
                classNames={{
                  day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-primary/10 text-primary",
                }}
              />
            </Card>
          </div>
        </motion.div>
      )}

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleNext}
          disabled={!state.location || !state.date}
          className="px-8 bg-primary hover:bg-primary/90"
          size="lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
