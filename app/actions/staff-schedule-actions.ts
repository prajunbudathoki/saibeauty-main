import prisma from "@/lib/prisma";
import { adminAuthMiddleware } from "@/middleware/admin-middleware";
import { createServerFn } from "@tanstack/react-start";

export const getStaffSchedules = createServerFn({
  method: "GET",
})
  .validator((input: { staffId: string; locationId: string }) => input)
  .handler(async ({ data: { staffId, locationId } }) => {
    try {
      const schedules = await prisma.staffSchedule.findMany({
        where: {
          staff_id: staffId,
          location_id: locationId,
        },
        orderBy: [{ day_of_week: "asc" }],
      });
      return schedules;
    } catch (error) {
      throw new Error("Failed to fetch staff schedules");
    }
  });

export const createStaffSchedule = createServerFn({
  method: "POST",
})
  .middleware([adminAuthMiddleware])
  .validator((form: any) => form)
  .handler(async ({ data: formData }) => {
    const staff_id = formData.get("staff_id") as string;
    const location_id = formData.get("location_id") as string;
    const day_of_week = Number(formData.get("day_of_week"));
    const start_time = formData.get("start_time") as string;
    const end_time = formData.get("end_time") as string;
    const is_available =
      formData.get("is_available") !== null
        ? Boolean(formData.get("is_available"))
        : true;

    if (!staff_id || !location_id || !start_time || day_of_week === undefined) {
      throw new Error("Missing required fields");
    }

    if (end_time && end_time <= start_time) {
      throw new Error("End time must be after start time");
    }

    const existingSchedule = await prisma.staffSchedule.findFirst({
      where: {
        staff_id,
        location_id,
        day_of_week,
        start_time,
      },
    });

    if (existingSchedule) {
      throw new Error("Schedule for this day and time already exists");
    }

    try {
      const schedule = await prisma.staffSchedule.create({
        data: {
          staff_id,
          location_id,
          start_time,
          end_time: end_time || "",
          day_of_week,
          is_available,
        },
      });
      return schedule;
    } catch (error) {
      console.error("Failed to create staff schedule:", error);
      throw new Error("Failed to create staff schedule");
    }
  });

export const updateStaffSchedule = createServerFn({
  method: "POST",
})
  .middleware([adminAuthMiddleware])
  .validator((input: { id: string; form: Record<string, any> }) => input)
  .handler(async ({ data: { id, form } }) => {
    const {
      staff_id,
      location_id,
      start_time,
      end_time,
      day_of_week,
      is_available,
    } = form;
    if (!staff_id || !location_id || !start_time || !day_of_week) {
      throw new Error("Required fields are missing");
    }
    if (end_time && end_time <= start_time) {
      throw new Error("End time must be after start time");
    }
    try {
      const updatedSchedule = await prisma.staffSchedule.update({
        where: { id },
        data: {
          staff_id,
          location_id,
          start_time,
          end_time: end_time || "",
          day_of_week,
          is_available:
            is_available !== undefined ? Boolean(is_available) : true,
        },
      });
      return updatedSchedule;
    } catch (error) {
      console.error("Failed to update staff schedule:", error);
      throw new Error("Failed to update staff schedule");
    }
  });

export const deleteStaffSchedule = createServerFn()
  .middleware([adminAuthMiddleware])
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      return await prisma.staffSchedule.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error("Failed to delete staff schedule");
    }
  });
