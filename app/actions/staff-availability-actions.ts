import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";

export const getStaffSpecialAvailability = createServerFn({
  method: "GET",
})
.validator((data: { staffId: string; locationId: string; month: number; year: number }) => data)
  .handler(async ({ data }) => {
    try {
      const specialAvailability =
        await prisma.staffSpecialAvailability.findMany({
          where: {
            staff_id: data.staffId,
            location_id: data.locationId,
            date: {
              gte: new Date(data.year, data.month - 1, 1).toISOString().split("T")[0],
              lt: new Date(data.year, data.month, 1).toISOString().split("T")[0],
            },
          },
          orderBy: [{ date: "asc" }],
        });
      return specialAvailability;
    } catch (error) {
      throw new Error("Failed to fetch special availability for staff");
    }
  });

export const getSpecialAvailabilityForDate = createServerFn({
  method: "GET",
})
  .validator(
    (data: { staffId: string; locationId: string; date: string }) => data
  )
  .handler(async ({ data }) => {
    try {
      const specialAvailability =
        await prisma.staffSpecialAvailability.findFirst({
          where: {
            staff_id: data.staffId,
            location_id: data.locationId,
            date: new Date(data.date),
          },
        });
      return specialAvailability;
    } catch (error) {
      throw new Error("Failed to fetch special availability for date");
    }
  });

export const upsertSpecialAvailability = createServerFn({
  method: "POST",
})
  .validator((form: Record<string, any>) => form)
  .handler(async ({ data: form }) => {
    const {
      staff_id,
      location_id,
      date,
      is_available,
      start_time,
      end_time,
      notes,
    } = form;
    if (is_available && start_time && end_time && end_time <= start_time) {
      throw new Error("End time must be after start time");
    }
    const existingRecord = await prisma.staffSpecialAvailability.findFirst({
      where: {
        staff_id,
        location_id,
        date: new Date(date),
      },
    });

    let result: any;

    if (existingRecord) {
      result = await prisma.staffSpecialAvailability.update({
        where: { id: existingRecord.id },
        data: {
          is_available,
          start_time,
          end_time,
          note: notes,
        },
      });
    } else {
      result = await prisma.staffSpecialAvailability.create({
        data: {
          staff_id,
          location_id,
          date: new Date(date),
          is_available,
          start_time,
          end_time,
          note: notes,
        },
      });
    }
    return result;
  });

export const deleteStaffSpecialAvailability = createServerFn()
  .validator((id: string, staffId: string, locationId: string) => ({
    id,
    staffId,
    locationId,
  }))
  .handler(async ({ data: { id, staffId, locationId } }) => {
    try {
      return await prisma.staffSpecialAvailability.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error("Failed to delete special availability");
    }
  });
