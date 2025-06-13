"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Testimonial } from "@/lib/type";
import {
  getTestimonialById,
  getTestimonials,
} from "@/actions/testimonial-actions";
import { formatDate } from "@/lib/utils";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const TestimonialCarousel = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const data = await getTestimonials();
        setTestimonials(
          Array.isArray(data)
            ? data.map((t) => ({
                ...t,
                created_at:
                  typeof t.created_at === "string"
                    ? t.created_at
                    : t.created_at?.toISOString?.() ?? "",
              }))
            : []
        );
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000); // Change testimonial every 6 seconds

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [testimonials.length]);

  const goToPrevious = () => {
    if (testimonials.length <= 1) return;
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToNext = () => {
    if (testimonials.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return <div className="text-center py-8">No testimonials available.</div>;
  }

  const testimonial = testimonials[currentIndex];

  const imageUrl = testimonial.image
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/saibeauty/${testimonial.image}`
    : undefined;

  const renderStars = () => {
    const stars: React.ReactNode[] = [];
    const rating = testimonial.rating;

    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
        );
      } else {
        stars.push(<Star key={i} className="h-5 w-5 text-muted-foreground" />);
      }
    }

    return stars;
  };

  return (
    <div className="relative">
      <div className="absolute -top-6 -left-6 text-primary/10">
        <Quote size={80} strokeWidth={1} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center relative z-10"
        >
          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-6 border-4 border-primary/20">
            <Avatar className="absolute inset-0 w-full h-full">
              <AvatarImage src={imageUrl} alt={testimonial.name} />
              <AvatarFallback className="text-2xl">
                {testimonial.name
                  ? testimonial.name.charAt(0).toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex items-center justify-center mb-4">
            {renderStars()}
          </div>

          <p className="text-lg md:text-xl italic mb-6 max-w-2xl">
            "{testimonial.review}"
          </p>

          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold">{testimonial.name}</h3>
            {testimonial.designation && (
              <p className="text-sm text-muted-foreground">
                {testimonial.designation}
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {testimonials.length > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            className="rounded-full h-10 w-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2 px-4">
            {testimonials.map((testimonial) => (
              <button
                type="button"
                key={testimonial.id}
                onClick={() =>
                  setCurrentIndex(testimonials.indexOf(testimonial))
                }
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  currentIndex === testimonials.indexOf(testimonial)
                    ? "bg-primary scale-125"
                    : "bg-muted-foreground/30"
                }`}
                aria-label={`Go to testimonial ${testimonial.id + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            className="rounded-full h-10 w-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};
