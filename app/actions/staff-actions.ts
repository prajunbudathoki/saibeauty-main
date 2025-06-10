import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";

export const getStaffsByLocation = createServerFn({
  method: "GET",
})
  .validator((locationId: string) => locationId)
  .handler(async ({ data: locationId }) => {
    try {
      const staffs = await prisma.staff.findMany({
        where: { location_id: locationId },
        orderBy: [{ index: "asc" }, { name: "asc" }],
      });
      return staffs;
    } catch (error) {
      throw new Error("Failed to fetch staff");
    }
  });

export const getAvailableStaffByLocation = createServerFn({
  method: "GET",
})
  .validator((locationId: string) => locationId)
  .handler(async ({ data: locationId }) => {
    try {
      const staffs = await prisma.staff.findMany({
        where: {
          location_id: locationId,
          is_available_for_booking: true,
        },
        orderBy: [{ index: "asc" }, { name: "asc" }],
      });
      return staffs;
    } catch (error) {
      throw new Error("Failed to fetch the staffs");
    }
  });

export const getStaffById = createServerFn({
  method: "GET",
})
  .validator((staffId: string) => staffId)
  .handler(async ({ data: staffId }) => {
    try {
      const staff = await prisma.staff.findUnique({
        where: {
          id: staffId,
        },
      });
      if (!staff) {
        throw new Error("Staff mmber not found");
      }
      return staff;
    } catch (error) {
      throw new Error("Failed to fetch staff member");
    }
  });

export const createStaff = createServerFn({
  method: "POST",
})
  .validator((form: Record<string, any>) => form)
  .handler(async ({ data: form }) => {
    const {
      location_id,
      name,
      role,
      bio,
      is_available_for_booking,
      index,
      facebook_url,
      instagram_url,
      twitter_url,
      image,
    } = form;

    if (!location_id || !name || !role) {
      throw new Error("Required fields are missing");
    }

    try {
      const staff = await prisma.staff.create({
        data: {
          location_id,
          name,
          role,
          bio: bio || null,
          image: image || null,
          is_available_for_booking:
            is_available_for_booking === "true" ||
            is_available_for_booking === true,
          index: Number.isFinite(Number(index)) ? Number(index) : 0,
          facebook_url: facebook_url || null,
          instagram_url: instagram_url || null,
          twitter_url: twitter_url || null,
        },
      });

      return staff;
    } catch (error) {
      throw new Error("Failed to create staff member");
    }
  });

export const updateStaff = createServerFn({
  method: "POST",
})
  .validator((input: { staffId: string; form: Record<string, any> }) => input)
  .handler(async ({ data: { staffId, form } }) => {
    const {
      location_id,
      name,
      role,
      bio,
      is_available_for_booking,
      index,
      facebook_url,
      instagram_url,
      twitter_url,
      image,
    } = form;

    if (!location_id || !name) {
      throw new Error("Required fields are missing");
    }

    try {
      const staff = await prisma.staff.update({
        where: { id: staffId },
        data: {
          location_id,
          name,
          role,
          bio: bio || null,
          image: image || null,
          is_available_for_booking:
            is_available_for_booking === "true" ||
            is_available_for_booking === true,
          index: Number.isFinite(Number(index)) ? Number(index) : 0,
          facebook_url: facebook_url || null,
          instagram_url: instagram_url || null,
          twitter_url: twitter_url || null,
        },
      });
      return staff;
    } catch (error) {
      throw new Error("Failed to update staff member");
    }
  });

export const deleteStaff = createServerFn({
  method: "POST",
})
  .validator((staffId:string) => staffId)
  .handler(async ({ data:staffId }) => {
    try {
      await prisma.staff.findUnique({
        where: { id: staffId },
        select: { image: true },
      });

      await prisma.staff.delete({
        where: { id: staffId },
      });

      return;
    } catch (error) {
      throw new Error("Failed to delete staff member");
    }
  });
