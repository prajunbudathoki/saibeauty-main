import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function FeaturedServices({ services }) {
  const imageUrl = undefined;
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
                src={imageUrl}
                alt="hello"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <img
                src={imageUrl}
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
