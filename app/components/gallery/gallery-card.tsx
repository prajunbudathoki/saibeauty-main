import { motion } from "motion/react";
import { formatDate, getCdnUrl } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { GalleryDialog } from "./gallery-dialog";
import { Trash2, Edit, Eye } from "lucide-react";
import { toast } from "sonner";
import { deleteGalleryItem } from "@/actions/gallery-actions";
import { useRouter } from "@tanstack/react-router";
import type { GalleryItem } from "@/generated/prisma";

export function GalleryCard({ galleryItem }: { galleryItem: GalleryItem }) {
  const router = useRouter();
  const handleDelete = async () => {
    try {
      await deleteGalleryItem({ data: galleryItem.id });
      toast.success("Gallery item deleted successfully");
      router.invalidate();
    } catch (error) {
      toast.error("Failed to delete the gallery item");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div
          className={"h-40 w-full"}
          style={{
            background: `url('${getCdnUrl(galleryItem.image)}')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button variant="secondary" size="sm" className="h-8">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        </div>
        <CardContent className="p-4 flex-1">
          <h3 className="font-bold text-lg mb-1">{galleryItem.title}</h3>
          {galleryItem.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {galleryItem.description}
            </p>
          )}
          <div className="mt-2 text-xs text-muted-foreground">
            {formatDate(galleryItem.created_at)}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-end">
          <div className="flex gap-2">
            <GalleryDialog
              galleryItem={galleryItem}
              title="Edit Gallery Item"
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />

            <ConfirmDialog
              title="Delete Gallery Item"
              description="Are you sure you want to delete this gallery item? This action cannot be undone."
              onConfirm={handleDelete}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
