import { getTestimonials } from "@/actions/testimonial-actions";
import { AdminHeader } from "@/components/shared/admin-header";
import { TestimonialCard } from "@/components/testimonial/testimonial-card";
import { TestimonialDialog } from "@/components/testimonial/testimonial-dialog";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/admin/testimonials/")({
  component: RouteComponent,
  loader: async () => {
    return {
      testimonials: await getTestimonials(),
    };
  },
});

function RouteComponent() {
  const { testimonials } = Route.useLoaderData();
  return (
    <div>
      <AdminHeader title="Testimonials" />

      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">All Testimonials</h2>

          <TestimonialDialog
            title="Add Testimonial"
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Testimonial
              </Button>
            }
          />
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No testimonials yet</h3>
            <p className="text-muted-foreground">
              Add your first testimonial to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
