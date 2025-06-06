import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AdminHeader } from "@/components/shared/admin-header";
import { CategoryCard } from "@/components/category/category-card";
import { CategoryDialog } from "@/components/category/category-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  getCategories,
  getCategoryServiceCount,
} from "@/actions/category-actions";

export const Route = createFileRoute("/admin/categories/")({
  component: RouteComponent,
  loader: async () => {
    const categories = await getCategories();
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const serviceCount = await getCategoryServiceCount({
          data: category.id,
        });
        return { category, serviceCount };
      })
    );
    return categoriesWithCounts;
  },
});

function RouteComponent() {
  const categories = Route.useLoaderData();

  return (
    <div>
      <AdminHeader title="Categories" />

      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">All Categories</h2>

          <CategoryDialog
            title="Add Category"
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            }
          />
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No categories yet</h3>
            <p className="text-muted-foreground">
              Add your first category to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ category, serviceCount }) => (
              <CategoryCard
                key={category.id}
                category={{
                  ...category,
                  created_at:
                    category.created_at instanceof Date
                      ? category.created_at.toISOString()
                      : category.created_at,
                }}
                serviceCount={serviceCount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
