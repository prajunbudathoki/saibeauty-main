import { createFileRoute, notFound } from "@tanstack/react-router";
import { getServicesByCategory } from "@/actions/service-actions";
import { getCategories } from "@/actions/category-actions";
import { AdminHeader } from "@/components/shared/admin-header";
import { ServiceCard } from "@/components/service/service-card";
import { ServiceDialog } from "@/components/service/service-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/admin/categories/$id")({
  loader: async ({ params }) => {
    const [services, categories] = await Promise.all([
      getServicesByCategory({ data: params.id }),
      getCategories(),
    ]);

    const category = categories.find((category) => category.id === params.id);

    if (!category) {
      throw notFound();
    }

    return { services, category, categories };
  },
  component: ServicesCategoryPage,
});

function ServicesCategoryPage() {
  const { services, category, categories } = Route.useLoaderData();

  return (
    <div>
      <AdminHeader title="Services" />

      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">
            All Services for {category.name}
          </h2>

          <ServiceDialog
            title="Add Service"
            categoryId={category.id}
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            }
          />
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No services yet</h3>
            <p className="text-muted-foreground">
              {categories.length === 0
                ? "Create a category first, then add services to it."
                : "Add your first service to get started."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={{
                  ...service,
                  created_at: service.created_at instanceof Date
                    ? service.created_at.toISOString()
                    : service.created_at,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

