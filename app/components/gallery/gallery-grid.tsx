import { useState } from "react";
import { motion } from "motion/react";
import GalleryImageModal from "./gallery-image-model";
import { Search, ZoomIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { GalleryItem } from "@/generated/prisma";
import { getCdnUrl } from "@/lib/utils";

interface GalleryGridProps {
  galleryItems: GalleryItem[];
}

export default function GalleryGrid({ galleryItems }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const openModal = (item: GalleryItem) => {
    setSelectedImage(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const getNextImage = () => {
    if (!selectedImage) return null;
    const currentIndex = galleryItems.findIndex(
      (item) => item.id === selectedImage.id
    );
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    return galleryItems[nextIndex];
  };

  const getPrevImage = () => {
    if (!selectedImage) return null;
    const currentIndex = galleryItems.findIndex(
      (item) => item.id === selectedImage.id
    );
    const prevIndex =
      (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    return galleryItems[prevIndex];
  };

  const handleNext = () => {
    const nextImage = getNextImage();
    if (nextImage) setSelectedImage(nextImage);
  };

  const handlePrev = () => {
    const prevImage = getPrevImage();
    if (prevImage) setSelectedImage(prevImage);
  };

  // Filter gallery items based on search term
  const filteredItems = galleryItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item?.description &&
        item?.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (galleryItems.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg p-8">
        <h3 className="text-xl font-semibold mb-2">No Gallery Items Yet</h3>
        <p className="text-muted-foreground">
          We're working on adding beautiful images to our gallery. Please check
          back soon!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search gallery..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-primary/20 focus-visible:ring-primary"
        />
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg p-8">
          <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
          <p className="text-muted-foreground">
            No gallery items match your search. Try different keywords.
          </p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
            hidden: {},
          }}
        >
          {filteredItems.map((item) => {
            const imageUrl = getCdnUrl(item.image);
            return (
              <motion.div
                key={item.id}
                className="group relative aspect-square rounded-xl overflow-hidden shadow-sm border border-primary/10 cursor-pointer"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
                onClick={() => openModal(item)}
              >
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  className="object-cover h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-semibold text-lg">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-white/90 text-sm line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-primary/80 text-white p-3 rounded-full">
                    <ZoomIn className="h-6 w-6" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {selectedImage && (
        <GalleryImageModal
          isOpen={modalOpen}
          onClose={closeModal}
          galleryItem={selectedImage}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </>
  );
}
