import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { motion } from "motion/react";
import { Clock, Scissors, Star } from "lucide-react";
import { Suspense } from "react";
import { ServicesTabs } from "@/components/services/services-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { getLocations } from "@/actions/location-actions";

export const Route = createFileRoute("/_client/services")({
  component: RouteComponent,
  loader: async () => {
    const locations = await getLocations();
    return locations;
  },
});

function RouteComponent() {
  const locations = Route.useLoaderData();
  // const { service } = locationService;
  // if (!service) return null;

  // const imageUrl = "https://picsum.photos/id/237/200/300";

  // const price =
  //   locationService.price !== null ? locationService.price : service.price;

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
              Premium Beauty Services
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Our Services
            </h1>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-xl text-muted-foreground">
              Discover our comprehensive range of beauty services available at
              our locations. Each service is performed by our skilled
              professionals using premium products.
            </p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute top-20 left-[10%] w-16 h-16 rounded-full bg-primary/10 z-0"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute bottom-20 right-[10%] w-24 h-24 rounded-full bg-primary/10 z-0"
        ></motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-muted/30 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm border border-primary/10 text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scissors className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Stylists</h3>
              <p className="text-muted-foreground">
                Our team of professionals is trained in the latest techniques
                and trends.
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
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Products</h3>
              <p className="text-muted-foreground">
                We use only the highest quality products for all our services.
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
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Convenient Booking</h3>
              <p className="text-muted-foreground">
                Easily book your appointments online or by phone at your
                convenience.
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
          <h2 className="text-3xl font-bold mb-4">
            Select a Location to View Services
          </h2>
          <p className="text-muted-foreground">
            Browse our services by location to find the perfect treatment for
            you. Each location offers a unique set of services tailored to our
            clients' needs.
          </p>
        </motion.div>

        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <ServicesTabs locations={locations} />
        </Suspense>
      </div>
    </div>
  );
  // return (
  //   <motion.div
  //     initial={{ opacity: 0, y: 20 }}
  //     animate={{ opacity: 1, y: 0 }}
  //     transition={{ duration: 0.4, delay: index * 0.05 }}
  //   >
  //     <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-all duration-300 group border-primary/10 hover:border-primary/30">
  //       <div className="relative h-48 overflow-hidden">
  //         <img
  //           src={imageUrl || "/placeholder.svg"}
  //           alt={service.name}
  //           className="object-cover transition-transform duration-500 group-hover:scale-110"
  //         />
  //         {service.category?.name && (
  //           <div className="absolute top-3 left-3 bg-primary/80 text-primary-foreground text-xs font-medium py-1 px-2 rounded-full">
  //             {service.category.name}
  //           </div>
  //         )}
  //         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-16" />
  //       </div>
  //       <CardHeader className="pb-2 pt-4">
  //         <div className="flex justify-between items-start">
  //           <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
  //             {service.name}
  //           </h3>
  //         </div>
  //       </CardHeader>
  //       <CardContent className="pb-2 flex-1">
  //         {service.description && (
  //           <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
  //             {service.description}
  //           </p>
  //         )}

  //         <div className="flex flex-wrap gap-3 items-center">
  //           {(locationService.duration || service.duration) && (
  //             <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
  //               <Clock className="h-3 w-3 text-primary" />
  //               <span>{locationService.duration || service.duration} min</span>
  //             </div>
  //           )}
  //           <div className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
  //             <Star className="h-3 w-3 fill-current" />
  //             <span>{formatPrice(price)}</span>
  //           </div>
  //         </div>
  //       </CardContent>
  //       {/* <CardFooter className="pt-2 border-t">
  //         <Link href="/profile/booking" className="w-full">
  //           <Button className="w-full bg-primary hover:bg-primary/90 transition-colors">Book Now</Button>
  //         </Link>
  //       </CardFooter> */}
  //     </Card>
  //   </motion.div>
  // );
}
