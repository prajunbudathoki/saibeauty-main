import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function BookingCTA() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 to-primary/10">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-primary/10"
        >
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-12 lg:p-16">
              <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                Ready to Feel Beautiful?
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Book Your Appointment Today
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Schedule your visit with our expert stylists and experience
                premium beauty services tailored just for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Link to="/profile/booking" className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Appointment
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/services" className="flex items-center">
                    View Services
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-full bg-primary/20">
              <div className="absolute inset-0 bg-[url('/12.webp?height=600&width=800')] bg-cover bg-center opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent md:bg-gradient-to-l" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
