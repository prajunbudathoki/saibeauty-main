"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SpecialAvailabilityDialog } from "./special-availability-dialog";
import { toast } from "sonner";
import { getStaffSpecialAvailability } from "@/actions/staff-availability-actions";

// Update the function signature to accept weeklySchedules
export function AvailabilityCalendar({ staffId, locationId, weeklySchedules }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [specialAvailability, setSpecialAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const res = await getStaffSpecialAvailability({
          data: { staffId, locationId, month, year },
        });
        setSpecialAvailability(res);
      } catch (error) {
        console.error("Error fetching special availability:", error);
        toast.error("Failed to load special availability");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [staffId, locationId, month, year]);

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const handleDialogClose = (refreshData = false) => {
    setDialogOpen(false);
    setSelectedDate(null);

    if (refreshData) {
      // Refresh data after changes
      getStaffSpecialAvailability({
        data: { staffId, locationId, month, year },
      })
        .then((data) => setSpecialAvailability(data))
        .catch((error) => {
          console.error("Error refreshing special availability:", error);
          toast.error("Failed to refresh special availability");
        });
    }
  };

  // Generate days for the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day names for the header
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Function to get availability for a specific date
  const getAvailabilityForDate = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return specialAvailability.find((a) => a.date === dateString);
  };

  // Function to check if a day has a regular weekly schedule
  const hasWeeklySchedule = (date: Date) => {
    const dayOfWeek = getDay(date); // 0 = Sunday, 1 = Monday, etc.
    return weeklySchedules.some(
      (schedule) => schedule.day_of_week === dayOfWeek
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Special Availability</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">{format(currentDate, "MMMM yyyy")}</div>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-sm font-medium py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {/* Render empty cells for days before the start of the month */}
              {Array.from({ length: getDay(monthStart) }).map((index) => (
                <div key={`empty-${index}`} className="aspect-square p-1" />
              ))}
              {/* Render the actual days of the month */}
              {days.map((day) => {
                const availability = getAvailabilityForDate(day);
                const hasRegularSchedule = hasWeeklySchedule(day);

                // Determine the availability status
                const isAvailable =
                  availability?.is_available ?? hasRegularSchedule;
                const isUnavailable =
                  availability && !availability.is_available;

                return (
                  <button
                    type="button"
                    key={day.toString()}
                    className={`
                      aspect-square p-1 rounded-md relative
                      hover:bg-muted transition-colors
                      ${isToday(day) ? "border border-primary" : ""}
                      ${
                        isAvailable && !isUnavailable
                          ? "bg-green-100 hover:bg-green-200"
                          : ""
                      }
                      ${isUnavailable ? "bg-red-100 hover:bg-red-200" : ""}
                    `}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="text-center">
                      <span
                        className={`text-sm ${isToday(day) ? "font-bold" : ""}`}
                      >
                        {format(day, "d")}
                      </span>

                      {/* Show indicator for special availability or regular schedule */}
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                        {availability ? (
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${
                              availability.is_available
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                        ) : hasRegularSchedule ? (
                          <div className="h-1.5 w-1.5 rounded-full bg-green-300" />
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span>Special Availability</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-green-300" />
                <span>Regular Schedule</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span>Unavailable</span>
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Click on a date to add or edit special availability
            </div>
          </>
        )}
      </CardContent>

      {selectedDate && (
        <SpecialAvailabilityDialog
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          date={selectedDate}
          staffId={staffId}
          locationId={locationId}
          hasRegularSchedule={hasWeeklySchedule(selectedDate)}
        />
      )}
    </Card>
  );
}
