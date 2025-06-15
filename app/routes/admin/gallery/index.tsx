import { getGalleryItems } from "@/actions/gallery-actions";
import { GalleryCard } from "@/components/gallery/gallery-card";
import { GalleryDialog } from "@/components/gallery/gallery-dialog";
import { AdminHeader } from "@/components/shared/admin-header";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/admin/gallery/")({
  component: RouteComponent,
  loader: async () => {
    const gallery = await getGalleryItems();
    return gallery;
  },
});

function RouteComponent() {
  const galleryItems = Route.useLoaderData();
  return (
    <div>
      <AdminHeader title="Gallery" />
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">All Gallery Items</h2>

          <GalleryDialog
            title="Add Gallery Item"
            galleryItem={galleryItems}
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Gallery Item
              </Button>
            }
          />
        </div>

        {galleryItems.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No gallery items yet</h3>
            <p className="text-muted-foreground">
              Add your first gallery item to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((galleryItem) => (
              <GalleryCard key={galleryItem.id} galleryItem={galleryItem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
