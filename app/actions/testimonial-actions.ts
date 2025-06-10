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
  .validator((d: { formData: FormData }) => d)
  .handler(async ({ data }) => {
    const { formData } = data;
    // const { data: session } = await authClient.getSession();
    // if (session?.user.role !== "admin") {
    //   throw new Error("Role doesnot have access");
    // }
    const testimonial = await prisma.testimonial.create({
      data: {
        name: formData.get("name") as string,
        designation: formData.get("designation") as string,
        rating: Number(formData.get("rating")),
        review: formData.get("review") as string,
      },
    });
    return testimonial;
  });

export const updateTestimonial = createServerFn({
  method: "POST",
})
  .validator((d: { id: string; formData: FormData }) => d)
  .handler(async ({ data }) => {
    const { id, formData } = data;
    // const { data: session } = await authClient.getSession();
    // if (session?.user.role !== "admin") {
    //   throw new Error("User is not an admin");
    // }

    // if (!name || !review || Number.isNaN(rating) || rating < 1 || rating > 5) {
    //   throw new Error("Required fields are missing or invalid");
    // }

    try {
      const updated = await prisma.testimonial.update({
        where: { id },
        data: {
          name: formData.get("name") as string,
          designation: formData.get("designation") as string,
          rating: Number(formData.get("rating")),
          review: formData.get("review") as string,
        },
      });
      return updated;
    } catch (error) {
      console.log("Error updating testimonial:", error);
      throw new Error("Failed to update testimonial");
    }
  });

export const deleteTestimonial = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      // const { data: session } = await authClient.getSession();
      // if (session?.user.role !== "admin") {
      //   throw new Error("Role doesnot have access");
      // }
      return await prisma.testimonial.delete({
        where: { id },
      });
    } catch (error) {
      console.log("Failed to delete", error);
      throw new Error("Failed to delete testimonial");
    }
  });
