import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";

export const getTestimonials = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    await prisma.testimonial.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
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
    const { data: session } = await authClient.getSession();
    if (session?.user.role !== "admin") {
      throw new Error("Role doesnot have access");
    }
    const testimonial = await prisma.testimonial.create({
      data: {
        name: data.name,
        designation: data.designation,
        rating: data.rating,
        review: data.review,
      },
    });
    return testimonial;
  });

export const updateTestimonial = createServerFn({
  method: "POST",
})
  .validator((d: { id: string; name: string; designaton: string }) => d)
  .handler(async ({ data }) => {});

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
