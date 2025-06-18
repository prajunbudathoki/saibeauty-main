import { getLocations } from "@/actions/location-actions";
import TeamTabsSkeleton from "@/components/team/team-tabs-skeleton";
import { TeamTabs } from "@/components/team/team-tabs";
import { createFileRoute } from "@tanstack/react-router";
import { Award, Heart, Sparkles, Users } from "lucide-react";
import { motion } from "motion/react";
import { Suspense } from "react";

export const Route = createFileRoute("/_client/team")({
  component: RouteComponent,
  loader: async () => {
    const locations = await getLocations();
    return { locations };
  },
});

function RouteComponent() {
  const { locations } = Route.useLoaderData();
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
              Meet Our Experts
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Our Team
            </h1>
            <div className="w-20 h-1 bg-primary mx-auto mb-6" />
            <p className="text-xl text-muted-foreground">
              Meet our talented team of beauty professionals dedicated to
              providing you with exceptional service and care. Each member
              brings unique skills and expertise to ensure you receive the best
              experience.
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

      {/* Team Values Section */}
      <div className="bg-muted/30 py-12">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-10 text-center"
          >
            Our Team Values
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm border border-primary/10 text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for excellence in every service we provide, ensuring
                the highest quality results.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm border border-primary/10 text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Passion</h3>
              <p className="text-muted-foreground">
                Our team is passionate about beauty and dedicated to helping you
                look and feel your best.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm border border-primary/10 text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Creativity</h3>
              <p className="text-muted-foreground">
                We bring creativity and innovation to our work, staying current
                with the latest trends and techniques.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 max-w-3xl mx-auto text-center"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Meet Our Staff By Location
          </h2>
          <p className="text-muted-foreground">
            Our talented team members are ready to serve you at each of our
            locations. Select a location to meet the staff and learn about their
            specialties.
          </p>
        </motion.div>

        <Suspense fallback={<TeamTabsSkeleton />}>
          <TeamTabs locations={locations} />
        </Suspense>
      </div>
    </div>
  );
}
