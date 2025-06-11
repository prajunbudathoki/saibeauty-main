import { getServices } from "@/actions/service-actions";
import { FeaturedServices } from "@/components/home/featured-services";
import { ServicesSkeleton } from "@/components/home/services-skeleton";
import { TestimonialCarousel } from "@/components/testimonial/testimonial-carousel";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Clock, MapPin, Scissors, Star } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/_client/")({
  component: RouteComponent,
  loader: async () => {
    const services = getServices();
    return services;
  },
});

function RouteComponent() {
  const services = Route.useLoaderData();
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-background to-muted/30 overflow-hidden">
        <div className="absolute inset-0 z-0 -right-80 opacity-20">
          <img
            src="/banner2-bg.png?height=1080&width=1920"
            alt="Background pattern"
            className="object-cover"
          />
        </div>
        <div className="container relative z-10 py-20 md:py-32 flex flex-col items-center">
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
            <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-2">
              Premium Beauty Services
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              Discover Your True <span className="text-primary">Beauty</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Experience luxury beauty services at multiple locations. Our team
              of professionals is dedicated to making you look and feel your
              best.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button asChild size="lg" className="px-8">
                <Link to="/services">View Our Services</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto"
          >
            <title>as</title>
            <path
              fill="hsl(var(--background))"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Premium Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer a wide range of beauty services to help you look and feel
              your best. Our team of professionals uses only the highest quality
              products.
            </p>
          </div>

          <Suspense fallback={<ServicesSkeleton />}>
            <FeaturedServices services={services} />
          </Suspense>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose Sai Beauty?
              </h2>
              <p className="text-muted-foreground mb-8">
                At Sai Beauty, we are committed to providing exceptional service
                and creating a relaxing environment for all our clients. Our
                team of professionals is dedicated to helping you look and feel
                your best.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Scissors className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Expert Stylists
                    </h3>
                    <p className="text-muted-foreground">
                      Our team consists of highly trained professionals with
                      years of experience.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Premium Products
                    </h3>
                    <p className="text-muted-foreground">
                      We use only the highest quality products for all our
                      services.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Convenient Hours
                    </h3>
                    <p className="text-muted-foreground">
                      We offer flexible scheduling to accommodate your busy
                      lifestyle.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Multiple Locations
                    </h3>
                    <p className="text-muted-foreground">
                      Visit us at any of our convenient locations throughout the
                      city.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-xl overflow-hidden shadow-xl">
                <img
                  src="/team.jpeg?height=800&width=600"
                  alt="Salon interior"
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-full z-0" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full z-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Clients Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our clients have to
              say about their experiences with us.
            </p>
          </div>

          <div className="bg-card border rounded-xl p-8 shadow-sm max-w-4xl mx-auto">
            <Suspense
              fallback={
                <div className="h-64 flex items-center justify-center">
                  Loading testimonials...
                </div>
              }
            >
              <TestimonialCarousel />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get in Touch
              </h2>
              <p className="text-muted-foreground mb-6">
                Have questions or ready to book an appointment? Send us a
                message and we'll get back to you as soon as possible.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Visit Us</h3>
                    <p className="text-muted-foreground">
                      Multiple locations throughout the city
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <title>divider</title>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Call Us</h3>
                    <p className="text-muted-foreground">(123) 456-7890</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <title>asd</title>
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Email Us</h3>
                    <p className="text-muted-foreground">info@saibeauty.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-sm border">
              {/* <ContactForm /> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
