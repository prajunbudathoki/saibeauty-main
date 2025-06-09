import prisma from "@/lib/prisma";
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
  .validator((form: Record<string, any>) => form)
  .handler(async ({ data: formData }) => {
    const {
      staff_id,
      location_id,
      start_time,
      day_of_week,
      end_time,
      is_available,
    } = formData;
    if (!staff_id || !location_id || !start_time || !day_of_week) {
      throw new Error("Required fields are missing");
    }
    if (end_time && new Date(end_time) <= new Date(start_time)) {
      throw new Error("End time must be after start time");
    }
    const existingSchedule = await prisma.staffSchedule.findFirst({
      where: {
        staff_id,
        location_id,
        day_of_week,
        start_time: new Date(start_time).toISOString(),
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
          start_time: new Date(start_time).toISOString(),
          end_time: end_time ? new Date(end_time).toISOString() : null,
          day_of_week,
          is_available: is_available !== undefined ? is_available : true,
        },
      });
      return schedule;
    } catch (error) {
      throw new Error("Failed to create staff schedule");
    }
  });

export const updateStaffSchedule = createServerFn({
  method: "POST",
})
  .validator((id: string, form: Record<string, any>) => ({ id, form }))
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
    if (end_time && new Date(end_time) <= new Date(start_time)) {
      throw new Error("End time must be after start time");
    }
    try {
      const updatedSchedule = await prisma.staffSchedule.update({
        where: { id },
        data: {
          staff_id,
          location_id,
          start_time: new Date(start_time).toISOString(),
          end_time: end_time ? new Date(end_time).toISOString() : null,
          day_of_week,
          is_available: is_available !== undefined ? is_available : true,
        },
      });
      return updatedSchedule;
    } catch (error) {
      throw new Error("Failed to update staff schedule");
    }
  });

export const deleteStaffSchedule = createServerFn()
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
