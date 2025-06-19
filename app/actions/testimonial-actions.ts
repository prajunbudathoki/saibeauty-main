import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";
import { zfd } from "zod-form-data";
import { uploadFileToS3 } from "./storage.action";
import { adminAuthMiddleware } from "@/middleware/admin-middleware";

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

const createTestimonialSchema = zfd.formData({
  name: zfd.text(),
  designation: zfd.text(),
  rating: zfd.numeric(),
  review: zfd.text(),
  image: zfd.file(),
});

export const createTestimonial = createServerFn({
  method: "POST",
})
  .middleware([adminAuthMiddleware])
  .validator((d: FormData) => createTestimonialSchema.parse(d))
  .handler(async ({ data }) => {
    const { name, designation, rating, review, image } = data;
    try {
      const path = await uploadFileToS3(image, "testimonials");
      return await prisma.testimonial.create({
        data: {
          name,
          designation,
          rating,
          review,
          image: path,
        },
      });
    } catch (error) {
      console.log("Error creating testimonial:", error);
      throw new Error("Failed to create testimonial");
    }
  });

const updateTestimonialSchema = zfd.formData({
  id: zfd.text(),
  name: zfd.text(),
  designation: zfd.text().optional(),
  rating: zfd.numeric(),
  review: zfd.text(),
});

export const updateTestimonial = createServerFn({
  method: "POST",
})
  .middleware([adminAuthMiddleware])
  .validator((d: FormData) => updateTestimonialSchema.parse(d))
  .handler(async ({ data }) => {
    const { name, id, rating, review, designation } = data;

    try {
      const updated = await prisma.testimonial.update({
        where: {
          id,
        },
        data: {
          name,
          designation,
          rating,
          review,
        },
      });
      return updated;
    } catch (error) {
      console.log("Error updating testimonial:", error);
      throw new Error("Failed to update testimonial");
    }
  });

export const deleteTestimonial = createServerFn()
  .middleware([adminAuthMiddleware])
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      return await prisma.testimonial.delete({
        where: { id },
      });
    } catch (error) {
      console.log("Failed to delete", error);
      throw new Error("Failed to delete testimonial");
    }
  });
