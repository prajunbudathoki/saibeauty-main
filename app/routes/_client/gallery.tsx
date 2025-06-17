import { getGalleryItems } from "@/actions/gallery-actions";
import GalleryGrid from "@/components/gallery/gallery-grid";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, ImageIcon, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export const Route = createFileRoute("/_client/gallery")({
  component: RouteComponent,
  loader: async () => {
    const galleryItems = await getGalleryItems();
    return { galleryItems };
  },
});

function RouteComponent() {
  const { galleryItems } = Route.useLoaderData();
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary/5 via-primary/10 to-background py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 pattern-dots pattern-primary pattern-bg-white pattern-size-4" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-t from-primary/10 to-transparent" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-block bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              Our Portfolio
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Our Gallery
            </h1>
            <div className="w-20 h-1 bg-primary mx-auto mb-6" />
            <p className="text-xl text-muted-foreground">
              Browse through our gallery to see examples of our work and the
              beautiful results we achieve for our clients. Each image
              represents our commitment to excellence and attention to detail.
            </p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute top-20 left-[10%] w-16 h-16 rounded-full bg-primary/10 z-0"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute bottom-20 right-[10%] w-24 h-24 rounded-full bg-primary/10 z-0"
        />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/10 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Before & After</h3>
              <p className="text-muted-foreground">
                See the stunning transformations we've created for our clients.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/10 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Best Work</h3>
              <p className="text-muted-foreground">
                Browse through a collection of our most impressive beauty
                services.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/10 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Salon Atmosphere</h3>
              <p className="text-muted-foreground">
                Get a glimpse of our beautiful salon spaces and relaxing
                environment.
              </p>
            </div>
          </div>
        </motion.div>

        <GalleryGrid galleryItems={galleryItems} />
      </div>
    </div>
  );
}
