import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";
import { UserSidebar } from "@/components/shared/user-sidebar";
import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";

export const Route = createFileRoute("/_client/profile/user-appointments")({
  component: AppointmentsPage,
});

const sample = [
  {
    id: 1,
    service: "Haircut & Styling",
    date: "2025-06-10",
    time: "10:30 AM",
    status: "Confirmed",
  },
  {
    id: 2,
    service: "Facial Treatment",
    date: "2025-06-15",
    time: "01:00 PM",
    status: "Pending",
  },
  {
    id: 3,
    service: "Manicure & Pedicure",
    date: "2025-06-20",
    time: "03:00 PM",
    status: "Cancelled",
  },
];

function AppointmentsPage() {
  const { data } = useSession();

  return (
    <div className="flex">
      <UserSidebar />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-muted-foreground">
              Your Appointments
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage and view your upcoming bookings
            </p>
          </div>
          <Button>Book New</Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sample.map((a) => (
            <Card key={a.id}>
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  {a.service}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{a.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ClockIcon className="h-4 w-4" />
                  <span>{a.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  {a.status === "Confirmed" && (
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  )}
                  {a.status === "Pending" && (
                    <ClockIcon className="h-4 w-4 text-yellow-500" />
                  )}
                  {a.status === "Cancelled" && (
                    <XCircleIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">{a.status}</span>
                </div>
                {a.status !== "Cancelled" && (
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
