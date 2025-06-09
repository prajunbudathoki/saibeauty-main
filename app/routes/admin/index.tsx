import { getAdminDashboardData } from "@/actions/admin-appointment-actions";
import { AdminHeader } from "@/components/shared/admin-header";
import { DashboardStats } from "@/components/shared/dashboard-stats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  MapPin,
  MessageSquare,
  Scissors,
  Star,
  TrendingUp,
} from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
  loader: async () => {
    return await getAdminDashboardData()
  },

});

function RouteComponent() {
  const { dashstats, dashrecents } = Route.useLoaderData();
  return (
    <div className="min-h-screen pb-8">
      <AdminHeader title="Dashboard" />

      <div className="container py-6 space-y-6">
        <Suspense fallback={<StatsLoading />}>
          <DashboardStats
            {...dashstats}
            appointmentStats={dashstats.appointmentStats}
          />
        </Suspense>

        <div className="grid gap-6 md:grid-cols-2">
          <Suspense fallback={<ActivityLoading />}>
            <RecentActivity recent={dashrecents} />
          </Suspense>

          <Card className="border border-border/50 hover:border-border hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks you might want to perform
                  </CardDescription>
                </div>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <a
                href="/admin/locations"
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 group"
              >
                <MapPin className="h-8 w-8 mb-2 text-primary/70 group-hover:text-primary transition-colors" />
                <span className="font-medium">Manage Locations</span>
              </a>
              <a
                href="/admin/services"
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 group"
              >
                <Scissors className="h-8 w-8 mb-2 text-primary/70 group-hover:text-primary transition-colors" />
                <span className="font-medium">Manage Services</span>
              </a>
              <a
                href="/admin/testimonials"
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 group"
              >
                <Star className="h-8 w-8 mb-2 text-primary/70 group-hover:text-primary transition-colors" />
                <span className="font-medium">Manage Testimonials</span>
              </a>
              <a
                href="/admin/contacts"
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 group"
              >
                <MessageSquare className="h-8 w-8 mb-2 text-primary/70 group-hover:text-primary transition-colors" />
                <span className="font-medium">View Contacts</span>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RecentActivity({ recent }: { recent: any }) {
  const { locations, services, testimonials, contacts } = recent;
  return (
    <Card className="border border-border/50 hover:border-border hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Latest updates across your salon</CardDescription>
          </div>
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recent Locations */}
        {locations && locations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm text-primary">
                New Locations
              </h3>
              <a
                href="/admin/locations"
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="h-3 w-3" />
              </a>
            </div>
            <div className="space-y-2">
              {locations.map((location: any) => (
                <div
                  key={location.id}
                  className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-muted transition-colors"
                >
                  {/* <div className="w-2 h-2 rounded-full bg-primary"></div> */}
                  <span className="flex-1">
                    {location.name} - {location.city}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {location.created_at &&
                      new Date(location.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Services */}
        {services && services.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm text-primary">New Services</h3>
              <a
                href="/admin/services"
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="h-3 w-3" />
              </a>
            </div>
            <div className="space-y-2">
              {services.map((service: any) => (
                <div
                  key={service.id}
                  className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="flex-1">{service.name}</span>
                  <span className="font-medium">${service.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Testimonials */}
        {testimonials && testimonials.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm text-primary">
                New Testimonials
              </h3>
              <a
                href="/admin/testimonials"
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="h-3 w-3" />
              </a>
            </div>
            <div className="space-y-2">
              {testimonials.map((testimonial: any) => (
                <div
                  key={testimonial.id}
                  className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="flex-1">{testimonial.name}</span>
                  <span className="flex items-center">
                    {testimonial.rating}{" "}
                    <Star className="h-3 w-3 ml-1 fill-primary text-primary" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Contacts */}
        {contacts && contacts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm text-primary">
                New Contact Requests
              </h3>
              <a
                href="/admin/contacts"
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="h-3 w-3" />
              </a>
            </div>
            <div className="space-y-2">
              {contacts.map((contact: any) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="flex-1">{contact.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {contact.created_at &&
                      new Date(contact.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-12 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ActivityLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-8">
        {[...Array(3)].map((i) => (
          <div key={i}>
            <Skeleton className="h-5 w-24 mb-2" />
            <div className="space-y-2">
              {[...Array(3)].map((j) => (
                <div key={j} className="flex items-center gap-2">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
