import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { uploadFileToS3 } from "./storage.action";

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

const createStaffSchema = zfd.formData({
  name: zfd.text(),
  location_id: zfd.text(),
  role: zfd.text(),
  index: zfd.text(),
  bio: zfd.text(),
  facebook_url: zfd.text(z.string().optional()),
  instagram_url: zfd.text(z.string().optional()),
  twitter_url: zfd.text(z.string().optional()),
  is_available_for_booking: zfd.checkbox({ trueValue: "true" }),
  image: zfd.file(z.instanceof(File).optional()),
});

export const createStaff = createServerFn({
  method: "POST",
})
  .validator((d: FormData) => createStaffSchema.parse(d))
  .handler(async ({ data }) => {
    const {
      location_id,
      name,
      role,
      bio,
      image,
      is_available_for_booking,
      index,
      facebook_url,
      instagram_url,
      twitter_url,
    } = data;

    // if (!location_id) {
    //   throw new Error("Required fields are missing");
    // }
    try {
      let path: string | undefined;
      if (image) {
        path = await uploadFileToS3(image, "Staffs");
      }
      return await prisma.staff.create({
        data: {
          location_id,
          name,
          role,
          bio,
          image: path,
          is_available_for_booking: is_available_for_booking === true,
          index: Number.isFinite(Number(index)) ? Number(index) : 0,
          facebook_url,
          instagram_url,
          twitter_url,
        },
      });
    } catch (error) {
      console.error("Prisma error creating staff:", error);
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
  .validator((staffId: string) => staffId)
  .handler(async ({ data: staffId }) => {
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
