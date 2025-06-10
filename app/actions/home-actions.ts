import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";

export const getFeaturedCategories = createServerFn({
  method: "GET",
})
  .validator((limit = 3) => limit)
  .handler(async ({ data: limit }) => {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        // take: limit,
        include: {
          services: true,
        },
      });
      return categories;
    } catch (error) {
      throw new Error("Failed to get Featured categories");
    }
  });

export const getFeaturedServices = createServerFn({
  method: "GET",
})
  .validator((limit = 3) => limit)
  .handler(async ({ data: limit }) => {
    try {
      const services = await prisma.service.findMany({
        orderBy: { name: "asc" },
        // take: limit,
      });
      return services;
    } catch (error) {
      throw new Error("Error fetching Featured Services");
    }
  });
