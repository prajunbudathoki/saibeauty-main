import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";
import { file, zfd } from "zod-form-data";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { uploadS3 } from "@/lib/upload";
import { json } from "node:stream/consumers";

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
  .validator((d: { formData: FormData }) => d)
  .handler(async ({ data }) => {
    // console.log("sdsd");
    const { formData } = data;
    const category_id = formData.get("category_id") as string;
    const image = formData.get("image") as File;
    const index = Number(formData.get("index"));
    // console.log("Image file",image.type);
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const description = formData.get("description") as string;
    const duration = Number(formData.get("duration"));

    const fileBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);
    const extension = image.name.split(".").pop();
    const fileName = `${randomUUID()}.${extension}`;
    const imageKey = `services/${fileName}`;

    // const bytes = await image.bytes();
    // writeFileSync("aaa.png", bytes);

    try {
      await uploadS3(
        buffer,
        process.env.BUCKET_NAME || "",
        imageKey,
        image.type
      );
      console.log("Image uploaded successfully");
      return await prisma.service.create({
        data: {
          name,
          description,
          duration,
          index,
          price,
          category_id,
          image: imageKey,
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
