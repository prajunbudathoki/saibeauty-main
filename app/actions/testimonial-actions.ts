import { authClient } from "@/lib/auth-client";
import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";

export const getTestimonials = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    return testimonials;
  } catch (error) {
    throw new Error("Failed to load testimonials");
  }
});

export const getTestimonialById = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    return await prisma.testimonial.findUnique({
      where: {
        id: data,
      },
    });
  });

export const createTestimonial = createServerFn({
  method: "POST",
})
  .validator(
    (d: {
      name: string;
      designation: string;
      rating: number;
      review: string;
    }) => d
  )
  .handler(async ({ data }) => {
    const { name, designation, rating, review } = data;
    // const { data: session } = await authClient.getSession();
    // if (session?.user.role !== "admin") {
    //   throw new Error("Role doesnot have access");
    // }
    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        designation,
        rating,
        review,
      },
    });
    return testimonial;
  });

export const updateTestimonial = createServerFn({
  method: "POST",
})
  .validator(
    (d: {
      id: string;
      name: string;
      designation?: string;
      rating: number;
      review: string;
      image?: string | null;
      newImageFileName?: string;
      deleteOldImage?: boolean;
    }) => d
  )
  .handler(async ({ data }) => {
    const { id, name, designation, rating, review, image } = data;
    // const { data: session } = await authClient.getSession();
    // if (session?.user.role !== "admin") {
    //   throw new Error("User is not an admin");
    // }

    if (!name || !review || Number.isNaN(rating) || rating < 1 || rating > 5) {
      throw new Error("Required fields are missing or invalid");
    }

    try {
      const updated = await prisma.testimonial.update({
        where: { id },
        data: {
          name,
          designation: designation || null,
          rating,
          review,
          image: image ?? undefined,
        },
      });
      return updated;
    } catch (error) {
      console.error("Error updating testimonial:", error);
      throw new Error("Failed to update testimonial");
    }
  });

export const deleteTestimonial = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    try {
      const { data: session } = await authClient.getSession();
      if (session?.user.role !== "admin") {
        throw new Error("Role doesnot have access");
      }
      await prisma.testimonial.delete({
        where: { id: data },
      });
    } catch (error) {
      console.log("Failed to delete", error);
      throw new Error("Failed to delete testimonial");
    }
  });
