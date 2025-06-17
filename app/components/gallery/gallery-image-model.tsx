import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { getCdnUrl } from "@/lib/utils";
import type { GalleryItem } from "@/generated/prisma";

interface GalleryImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  galleryItem: GalleryItem;
  onNext: () => void;
  onPrev: () => void;
}

export default function GalleryImageModal({
  isOpen,
  onClose,
  galleryItem,
  onNext,
  onPrev,
}: GalleryImageModalProps) {
  const imageUrl = `${getCdnUrl(galleryItem.image)}`;
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowRight") {
        onNext();
      } else if (e.key === "ArrowLeft") {
        onPrev();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background/95 backdrop-blur-sm border-none shadow-2xl">
        <div className="relative rounded-lg overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="relative aspect-[4/3] md:aspect-[16/9] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={galleryItem.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full"
              >
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={galleryItem.title}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-6 bg-background">
            <h3 className="text-2xl font-semibold mb-2">{galleryItem.title}</h3>
            {galleryItem.description && (
              <p className="text-muted-foreground">{galleryItem.description}</p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-12 w-12"
            onClick={onPrev}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-12 w-12"
            onClick={onNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
