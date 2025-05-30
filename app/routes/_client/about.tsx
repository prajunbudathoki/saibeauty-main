import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Star } from "lucide-react";
import { motion } from "motion/react";
export const Route = createFileRoute("/_client/about")({
  component: RouteComponent,
});

function RouteComponent() {
  const services = [
    {
      title: "Hair Styling & Treatments",
      description:
        "Transform your hair with our expert styling and nourishing treatments",
      features: [
        "Professional cuts & styling for all hair types",
        "Deep conditioning & repair treatments",
        "Color consultation & application",
        "Keratin treatments & smoothing",
        "Special occasion styling",
      ],
      icon: "✂️",
    },
    {
      title: "Skincare & Facials",
      description: "Rejuvenate your skin with our customized facial treatments",
      features: [
        "Deep cleansing & exfoliation",
        "Anti-aging & hydrating facials",
        "Acne treatment & prevention",
        "Brightening & pigmentation care",
        "Luxury spa facial experiences",
      ],
      icon: "✨",
    },
    {
      title: "Waxing & Threading",
      description:
        "Gentle and precise hair removal services for smooth, beautiful skin",
      features: [
        "Full body waxing services",
        "Precision eyebrow threading",
        "Upper lip & facial threading",
        "Brazilian & bikini waxing",
        "Sensitive skin-friendly options",
      ],
      icon: "🌟",
    },
    {
      title: "Bridal & Party Makeup",
      description:
        "Look stunning on your special day with our professional makeup artistry",
      features: [
        "Bridal makeup consultation & trial",
        "Traditional & contemporary looks",
        "Party & event makeup",
        "Makeup for photoshoots",
        "Makeup lessons & tutorials",
      ],
      icon: "💄",
    },
    {
      title: "Henna Designs",
      description:
        "Beautiful traditional and modern henna art for all occasions",
      features: [
        "Bridal henna packages",
        "Traditional & Arabic designs",
        "Modern & contemporary patterns",
        "Party & festival henna",
        "Custom design consultations",
      ],
      icon: "🎨",
    },
    {
      title: "Additional Services",
      description: "Complete beauty solutions tailored to your needs",
      features: [
        "Manicure & pedicure services",
        "Lash extensions & tinting",
        "Massage & relaxation therapy",
        "Beauty consultations",
        "Bridal packages & group bookings",
      ],
      icon: "💅",
    },
  ];

  const branches = [
    {
      location: "United Kingdom",
      year: "2012",
      status: "Established Branch",
    },
    {
      location: "Dubai",
      year: "2023",
      status: "New Branch",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section
        className="relative py-20 px-4 text-center bg-texture"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="salon-container">
          <motion.div variants={itemVariants}>
            <Badge className="mb-6 bg-secondary text-secondary-foreground hover:bg-secondary/80">
              Since 2012
            </Badge>
          </motion.div>
          <motion.h1
            className="salon-heading bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6"
            variants={itemVariants}
          >
            SAI BEAUTY SALON
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed"
            variants={itemVariants}
          >
            Where beauty meets tradition, and every client is treated like
            royalty
          </motion.p>
          <motion.div
            style={{
              aspectRatio: "1280/516",
            }}
            className="relative w-full  rounded-2xl overflow-hidden shadow-2x bg-contain bg-[url('/teamcropped.png')] "
            variants={scaleIn}
          ></motion.div>
        </div>
      </motion.section>

      {/* Our Story Section */}
      <section className="py-16 px-4">
        <div className="salon-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideInLeft}
            >
              <h2 className="salon-subheading text-foreground mb-6">
                Our Story
              </h2>
              <div className="salon-divider"></div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <motion.p
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  With roots that go back to 2012 in the United Kingdom, SAI
                  BEAUTY SALON has been dedicated to enhancing natural beauty
                  through expert care, passion, and personalized service. Our
                  commitment to quality and customer satisfaction has made us a
                  trusted name in the beauty industry.
                </motion.p>
                <motion.p
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  In 2023, we proudly expanded to Dubai, bringing with us over a
                  decade of experience and a deep understanding of what it means
                  to make people feel confident and beautiful. Our Dubai branch
                  continues our tradition of excellence, offering a wide range
                  of beauty services tailored to meet the diverse needs of our
                  clientele.
                </motion.p>
              </div>
            </motion.div>
            <motion.div
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideInRight}
            >
              <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/banner.png"
                  alt="Beauty salon services"
                  className="object-cover"
                />
              </div>
              <motion.div
                className="absolute -bottom-6 -right-6 bg-card p-4 rounded-xl shadow-lg border border-border"
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary fill-current" />
                  <span className="font-semibold text-foreground">
                    11+ Years
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">of Excellence</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <motion.section
        className="py-16 px-4 bg-muted"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="salon-container text-center">
          <motion.h2
            className="salon-subheading text-foreground mb-8"
            variants={itemVariants}
          >
            Meet Our Founder
          </motion.h2>
          <motion.div
            className="salon-divider"
            variants={itemVariants}
          ></motion.div>
          <motion.div
            className="bg-card rounded-2xl p-8 md:p-12 border border-border"
            variants={scaleIn}
          >
            <motion.div
              className="w-32 h-32 mx-auto mb-6 relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="/founder.png"
                alt="Founder portrait"
                className="object-cover rounded-full shadow-lg"
              />
            </motion.div>
            <motion.p
              className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Behind our success is our founder, a certified beautician from the
              United Kingdom with over 20 years of hands-on experience in the
              beauty industry. Her vision, expertise, and personal dedication to
              excellence are reflected in every aspect of the salon — from the
              services we offer to the welcoming atmosphere we provide.
            </motion.p>
            <motion.div
              className="flex justify-center items-center gap-2 mt-6"
              variants={itemVariants}
            >
              <Badge variant="outline" className="bg-background border-border">
                <Calendar className="w-4 h-4 mr-1" />
                20+ Years Experience
              </Badge>
              <Badge variant="outline" className="bg-background border-border">
                UK Certified
              </Badge>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-dots">
        <div className="salon-container">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.h2
              className="salon-subheading text-foreground mb-4"
              variants={itemVariants}
            >
              Our Specialties
            </motion.h2>
            <motion.div
              className="salon-divider"
              variants={itemVariants}
            ></motion.div>
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Our team of professional beauty experts is committed to staying
              up-to-date with the latest trends and techniques, ensuring that
              you receive the highest standard of care in a warm and welcoming
              environment.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid lg:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="salon-card group hover:shadow-xl transition-all duration-300 bg-card h-full">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <motion.div
                        className="text-3xl bg-primary text-primary-foreground p-3 rounded-xl flex items-center justify-center min-w-[60px] h-[60px]"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        {service.icon}
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-foreground mb-2">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground text-sm uppercase tracking-wide">
                        What We Offer:
                      </h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            className="flex items-center gap-3 text-muted-foreground"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: featureIndex * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                            <span className="text-sm">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Branches Section */}
      <motion.section
        className="py-16 px-4 bg-muted"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="salon-container">
          <motion.h2
            className="salon-subheading text-foreground text-center mb-12"
            variants={itemVariants}
          >
            Our Locations
          </motion.h2>
          <motion.div
            className="salon-divider"
            variants={itemVariants}
          ></motion.div>
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer}
          >
            {branches.map((branch, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="salon-card overflow-hidden group">
                  <motion.div
                    className="relative h-48"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={`/placeholder.svg?height=192&width=400`}
                      alt={`${branch.location} branch`}
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={
                          index === 0
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent text-accent-foreground"
                        }
                      >
                        {branch.status}
                      </Badge>
                    </div>
                  </motion.div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-bold text-foreground">
                        {branch.location}
                      </h3>
                    </div>
                    <p className="text-muted-foreground">
                      Established in {branch.year}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
