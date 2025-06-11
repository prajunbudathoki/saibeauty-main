import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";
import { zfd } from "zod-form-data";
import { uploadFileToS3 } from "./storage.action";

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

const createServiceSchema = zfd.formData({
  name: zfd.text(),
  description: zfd.text().optional(),
  duration: zfd.numeric().optional(),
  price: zfd.numeric(),
  category_id: zfd.text(),
  index: zfd.numeric(),
  image: zfd.file(),
});

export const createService = createServerFn({
  method: "POST",
})
  .validator((d: FormData) => createServiceSchema.parse(d))
  .handler(async ({ data }) => {
    const { category_id, image, index, name, price, description, duration } =
      data;

    try {
      const path = await uploadFileToS3(image, "service");
      return await prisma.service.create({
        data: {
          name,
          description,
          duration,
          index,
          price,
          category_id,
          image: path,
        },
      });
    } catch (error) {
      throw new Error("Failed to create service");
    }
  });

export const deleteService = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    try {
      // const { data: session, error } = await authClient.getSession();
      // if (session?.user.role !== "admin") {
      //   throw new Error("Role doesnot have access");
      // }

      return await prisma.service.delete({
        where: {
          id: data,
        },
      });
    } catch (error) {
      throw new Error("Failed to delete service");
    }
  });
