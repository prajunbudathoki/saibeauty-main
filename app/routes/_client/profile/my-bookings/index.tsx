import { useState, useEffect } from "react";
import { getBookingsByEmail, getMyBookings } from "@/actions/booking-actions";
import { BookingCard } from "@/components/booking/booking-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Search,
  Calendar,
  MailQuestion, 
  CalendarCheck,
  CalendarClock,
} from "lucide-react";
import { motion } from "motion/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";

export const Route = createFileRoute("/_client/profile/my-bookings/")({
  component: RouteComponent,
  loader: async () => {
    const session = useSession();
    const authUser = session.data?.user.email;
    console.log("authuser", authUser);
    const bookings = await getMyBookings();
    return { bookings, authUser };
  },
});

function RouteComponent() {
  const { bookings } = Route.useLoaderData();
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [pastBookings, setPastBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      if ("error" in bookings) {
        setError("Failed to fetch bookings");
        setUpcomingBookings([]);
        setPastBookings([]);
      } else {
        setUpcomingBookings(bookings.upcoming || []);
        setPastBookings(bookings.past || []);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleBookingCancelled = () => {
    // Refresh the bookings list
    fetchBookings();
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

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          My Bookings
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          View and manage all your appointments in one place
        </p>
      </motion.div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">
            Searching for your bookings...
          </p>
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-red-50 rounded-xl border border-red-200"
        >
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MailQuestion className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-medium text-red-800 mb-2">
            Error Finding Bookings
          </h3>
          <p className="text-red-600 max-w-md mx-auto">{error}</p>
        </motion.div>
      ) : (
        <>
          {upcomingBookings.length === 0 && pastBookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-muted/30 rounded-xl border border-muted"
            >
              <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MailQuestion className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-medium mb-3">No bookings found</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                We couldn't find any bookings associated with you
              </p>
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <Link to="/profile/booking">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book an Appointment
                </Link>
              </Button>
            </motion.div>
          ) : (
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 h-14 p-1 bg-muted/50">
                <TabsTrigger
                  value="upcoming"
                  className="flex gap-2 h-12 data-[state=active]:bg-white"
                >
                  <CalendarCheck className="h-5 w-5" />
                  Upcoming ({upcomingBookings.length})
                </TabsTrigger>
                <TabsTrigger
                  value="past"
                  className="flex gap-2 h-12 data-[state=active]:bg-white"
                >
                  <CalendarClock className="h-5 w-5" />
                  Past ({pastBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                {upcomingBookings.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 bg-muted/30 rounded-xl border border-muted"
                  >
                    <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">
                      No upcoming bookings
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      You don't have any upcoming appointments
                    </p>
                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <Link to="/profile/booking">
                        <Calendar className="mr-2 h-4 w-4" />
                        Book an Appointment
                      </Link>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    className="space-y-6"
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    {upcomingBookings.map((booking) => (
                      <motion.div key={booking.id} variants={item}>
                        <BookingCard
                          booking={booking}
                          onCancelled={handleBookingCancelled}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="past">
                {pastBookings.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 bg-muted/30 rounded-xl border border-muted"
                  >
                    <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarClock className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">
                      No past bookings
                    </h3>
                    <p className="text-muted-foreground">
                      You don't have any past appointments
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    className="space-y-6"
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    {pastBookings.map((booking) => (
                      <motion.div key={booking.id} variants={item}>
                        <BookingCard key={booking.id} booking={booking} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </div>
  );
}
