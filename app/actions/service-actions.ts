import { authClient } from "@/lib/auth-client";
import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";

export const getServices = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        index: "asc",
      },
    });
    return services;
  } catch (error) {
    throw new Error("Failed to get services");
  }
});

export const getServicesByCategory = createServerFn({
  method: "GET",
})
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    try {
      const services = await prisma.service.findMany({
        where: { category_id: data },
        orderBy: { index: "asc" },
        include: { category: true },
      });
      return services;
    } catch (error) {
      console.error("Error fetching services by category:", error);
      throw new Error("Failed to fetch services");
    }
  });

export const getServiceById = createServerFn({
  method: "GET",
})
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    await prisma.service.findUnique({
      where: {
        id: data,
      },
    });
  });

export const createService = createServerFn({
  method: "POST",
})
  .validator(
    (data: {
      name: string;
      description?: string;
      duration?: number;
      price: number;
      category_id: string;
      index: number;
    }) => data
  )
  .handler(
    async ({
      data: { name, description, price, index, duration, category_id },
    }) => {
      // const { data: session, error } = await authClient.getSession();
      // if (session?.user.role !== "admin") {
      //   throw new Error("Role doesnot have access");
      // }
      try {
        return await prisma.service.create({
          data: {
            name,
            description,
            duration,
            index,
            price,
            category_id,
          },
        });
      } catch (error) {
        throw new Error("Failed to create service");
      }
    }
  );

export const deleteService = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    const { id } = data;
    try {
      // const { data: session, error } = await authClient.getSession();
      // if (session?.user.role !== "admin") {
      //   throw new Error("Role doesnot have access");
      // }

      return await prisma.service.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error("Failed to delete service");
    }
  });
