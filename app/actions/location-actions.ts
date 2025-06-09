import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";

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

export const createLocation = createServerFn({
  method: "POST",
})
  .validator((form: Record<string, any>) => form)
  .handler(async ({ data}) => {
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
    } = data

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
      const location = await prisma.location.create({
        data: {
          name,
          address,
          city,
          phone,
          email: email || null,
          description: description || null,
          image: image || null,
          opening_time,
          closing_time,
          is_open_on_weekends:
            is_open_on_weekends === "true" || is_open_on_weekends === true,
          google_maps_url: google_maps_url || null,
        },
      });

      return location;
    } catch (error) {
      throw new Error("Failed to create location");
    }
  });

export const updateLocation = createServerFn({
  method: "POST",
})
  .validator((input: { id: string; form: Record<string, any> }) => input)
  .handler(async ({ data: { id, form } }) => {
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
    } = form;

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
      const location = await prisma.location.update({
        where: { id },
        data: {
          name,
          address,
          city,
          phone,
          email: email || null,
          description: description || null,
          image: image || null,
          opening_time,
          closing_time,
          is_open_on_weekends:
            is_open_on_weekends === "true" || is_open_on_weekends === true,
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
