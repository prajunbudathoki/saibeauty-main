import { getLocations } from "@/actions/location-actions";
import { ContactForm } from "@/components/contact/contact-form";
import { LocationContactCard } from "@/components/location/location-contact-card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_client/contact")({
  component: RouteComponent,
  loader: async () => {
    const locations = await getLocations();
    return locations;
  },
});

function RouteComponent() {
  const locations = Route.useLoaderData();
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-muted/30 py-16 md:py-24">
        <div className="absolute inset-0 z-0 opacity-10">
          <img
            src="/services.jpg?height=800&width=1920"
            alt="Background pattern"
            className="object-cover"
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <div className="w-20 h-1 bg-primary mb-6"></div>
            <p className="text-xl text-muted-foreground">
              We'd love to hear from you! Fill out the form below or visit one
              of our locations.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold mb-8">Send Us a Message</h2>
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <ContactForm />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-8">Our Locations</h2>
            <div className="grid gap-6">
              {locations.map((location) => (
                <LocationContactCard key={location.id} location={location} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-muted/30 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Find Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visit us at any of our convenient locations throughout the city.
            </p>
          </div>

          <div className="aspect-[21/9] w-full rounded-xl overflow-hidden border shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596552044!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sca!4v1648482801994!5m2!1sen!2sca"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
