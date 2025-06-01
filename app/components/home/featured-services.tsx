import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Service } from "@/lib/type";
import { Link } from "@tanstack/react-router";

interface FeaturedServicesProps {
  services: Service[];
}

export function FeaturedServices({ services }: FeaturedServicesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service, index) => (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group bg-card hover:bg-primary/5 border rounded-xl overflow-hidden transition-colors"
        >
          <div className="relative h-48 overflow-hidden">
            {service.image ? (
              <img
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/saibeauty/${service.image}`}
                alt={service.name}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <img
                src="/placeholder.svg?height=400&width=600"
                alt={service.name}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            )}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {service.description ||
                `Experience our premium ${service.name.toLowerCase()} service.`}
            </p>
            <Link
              to="/services"
              className="inline-flex items-center text-primary font-medium"
            >
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
