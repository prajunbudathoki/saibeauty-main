import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";
import { zfd } from "zod-form-data";
import { uploadFileToS3 } from "./storage.action";
import { z } from "zod";
import { adminAuthMiddleware } from "@/middleware/admin-middleware";

export const getLocations = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { updated_at: "asc" },
    });
    return locations;
  } catch (error) {
    throw new Error("Error fetching locations");
  }
});

export const getLocationById = createServerFn({
  method: "GET",
})
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    return await prisma.location.findUnique({
      where: {
        id: data,
      },
    });
  });

const createLocationSchema = zfd.formData({
  name: zfd.text(),
  address: zfd.text(),
  city: zfd.text(),
  phone: zfd.text(),
  email: zfd.text(z.string().optional()),
  description: zfd.text(z.string().optional()),
  is_open_on_weekends: zfd.checkbox({ trueValue: "true" }),
  image: zfd.file(z.instanceof(File).optional()),
  opening_time: zfd.text(),
  closing_time: zfd.text(),
  google_maps_url: zfd.text(z.string().optional()),
});

export const createLocation = createServerFn({
  method: "POST",
})
  .middleware([adminAuthMiddleware])
  .validator((d: FormData) => createLocationSchema.parse(d))
  .handler(async ({ data }) => {
    const {
      name,
      address,
      city,
      phone,
      email,
      description,
      opening_time,
      closing_time,
      is_open_on_weekends,
      google_maps_url,
      image,
    } = data;

    if (
      !name ||
      !address ||
      !city ||
      !phone ||
      !opening_time ||
      !closing_time
    ) {
      throw new Error("Required fields are missing");
    }
    try {
      let path: string | undefined;
      if (image) {
        path = await uploadFileToS3(image, "locations");
      }
      return await prisma.location.create({
        data: {
          name,
          address,
          city,
          phone,
          email,
          description,
          image: path,
          opening_time,
          closing_time,
          is_open_on_weekends: is_open_on_weekends === true,
          google_maps_url,
        },
      });
    } catch (error) {
      throw new Error("Failed to create location");
    }
  });

const updateLocationSchema = zfd.formData({
  id: zfd.text(),
  name: zfd.text(),
  address: zfd.text(),
  city: zfd.text(),
  phone: zfd.text(),
  email: zfd.text(z.string().optional()),
  description: zfd.text(z.string().optional()),
  is_open_on_weekends: zfd.checkbox({ trueValue: "true" }),
  image: zfd.file(z.instanceof(File).optional()),
  opening_time: zfd.text(),
  closing_time: zfd.text(),
  google_maps_url: zfd.text(z.string().optional()),
});

export const updateLocation = createServerFn({
  method: "POST",
})
  .middleware([adminAuthMiddleware])
  .validator((d: FormData) => updateLocationSchema.parse(d))
  .handler(async ({ data }) => {
    const {
      id,
      name,
      address,
      city,
      phone,
      email,
      description,
      opening_time,
      closing_time,
      is_open_on_weekends,
      google_maps_url,
      image,
    } = data;

    if (
      !name ||
      !address ||
      !city ||
      !phone ||
      !opening_time ||
      !closing_time
    ) {
      throw new Error("Required fields are missing");
    }

    try {
      let path: string | undefined;
      if (image) {
        path = await uploadFileToS3(image, "locations");
      }
      const location = await prisma.location.update({
        where: { id },
        data: {
          name,
          address,
          city,
          phone,
          email: email || null,
          description: description || null,
          image: path,
          opening_time,
          closing_time,
          is_open_on_weekends: is_open_on_weekends === true,
          google_maps_url: google_maps_url || null,
          updated_at: new Date(),
        },
      });
      return location;
    } catch (error) {
      throw new Error("Failed to update location");
    }
  });

export const deleteLocation = createServerFn({
  method: "POST",
})
  .middleware([adminAuthMiddleware])
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      await prisma.location.findUnique({
        where: { id },
        select: { image: true },
      });

      await prisma.location.delete({
        where: { id },
      });

      return;
    } catch (error) {
      throw new Error("Failed to delete location");
    }
  });
