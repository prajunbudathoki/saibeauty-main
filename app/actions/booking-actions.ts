import { useSession } from "@/lib/auth-client";
import prisma from "@/lib/prisma";
import type { TimeSlot } from "@/lib/type";
import { createServerFn } from "@tanstack/react-start";
import { addMinutes, getDay, isBefore, parseISO } from "date-fns";

export const getLocations = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const locations = await prisma.location.findMany({
      orderBy: {
        updated_at: "asc",
      },
    });
    return locations;
  } catch (error) {
    throw new Error("Failed to fetch locations");
  }
});

export const getLocationServices = createServerFn({
  method: "GET",
})
  .validator((locationId: string) => locationId)
  .handler(async ({ data: locationId }) => {
    try {
      const services = await prisma.locationService.findMany({
        where: { location_id: locationId },
        orderBy: { created_at: "asc" },
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      });

      return services;
    } catch (error) {
      console.error("Failed to fetch services:", error);
      throw new Error("Failed to fetch services for the location");
    }
  });

export const getLocationStaffs = createServerFn({
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
      throw new Error("Failed to fetch staff members");
    }
  });

export const getAvailableStaff = createServerFn({
  method: "GET",
})
  .validator(
    (data: { locationId: string; date: string; serviceIds: string[] }) => data
  )
  .handler(async ({ data }) => {
    const { locationId, date, serviceIds } = data;

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
      throw new Error("Failed to fetch available staff members");
    }
  });
// export const createAppointment = createServerFn({
//   method: "POST",
// })
//   .validator((data: { formData: FormData }) => data)
//   .handler(async ({ data }) => {
//     const { formData } = data;
//     try {
//       const appointment = await prisma.appointment.create({
//         data: {
//           location_id: formData.get("location_id") as string,
//           staff_id: formData.get("staff_id") as string,
//           customer_name: formData.get("customer_name") as string,
//           customer_email: formData.get("customer_email") as string,
//           customer_phone: formData.get("customer_phone") as string,
//         },
//       });
//       return appointment;
//     } catch (error) {
//       throw new Error("Failed to create appointment");
//     }
//   });

export const createAppointment = createServerFn()
  .validator((d: FormData) => d)
  .handler(async ({ data: formData }) => {
    try {
      const user = useSession();
      const customer_id = user.data?.user.id;

      const location_id = formData.get("location_id") as string;
      const staff_id = formData.get("staf_id") as string | null;
      const start_time = formData.get("start_time") as string;
      const end_time = formData.get("end_time") as string;
      const customer_name = formData.get("customer_name") as string;
      const customer_email = formData.get("customer_email") as string;
      const customer_phone = formData.get("customer_phone") as string;
      const customer_notes = formData.get("customer_notes") as string;
      const total_price = Number(formData.get("total_price") as string);

      const serviceIds = formData.getAll("serviceIds") as string[];
      const servicePrices = formData.getAll("servicePrices") as string[];
      const serviceDurations = formData.getAll("serviceDurations") as string[];

      if (
        !location_id ||
        !start_time ||
        !end_time ||
        !customer_name ||
        !customer_email ||
        serviceIds.length === 0
      ) {
        throw new Error("Missing required fields");
      }

      const services = serviceIds.map((id, index) => ({
        id,
        price: Number(servicePrices[index]),
        duration: Number(serviceDurations[index] || "0"),
      }));

      const [appointment] = await prisma.$transaction(async (tx) => {
        const appointment = await tx.appointment.create({
          data: {
            customer_id,
            location_id,
            staff_id,
            start_time: new Date(start_time),
            end_time: new Date(end_time),
            status: "pending",
            total_price,
            customer_name,
            customer_email,
            customer_phone,
            notes: customer_notes,
            services: {
              create: services.map((service) => ({
                location_service_id: service.id,
                price: service.price,
                duration: service.duration,
              })),
            },
          },
          include: {
            services: {
              include: {
                locationService: {
                  include: {
                    service: true,
                  },
                },
              },
            },
          },
        });

        return [appointment];
      });

      return appointment.id;
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      throw new Error("Failed to create appointment");
    }
  });

export const getAvailableTimeSlots = createServerFn({
  method: "GET",
})
  .validator(
    (data: {
      locationId: string;
      staffId: string | null;
      date: string;
      serviceDuration: number;
    }) => data
  )
  .handler(async ({ data }) => {
    const { locationId, staffId, date, serviceDuration } = data;

    try {
      const location = await prisma.location.findUnique({
        where: { id: locationId },
        select: {
          opening_time: true,
          closing_time: true,
          is_open_on_weekends: true,
        },
      });

      if (!location) return [];

      const dayOfWeek = getDay(new Date(date));
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      if (isWeekend && !location.is_open_on_weekends) return [];

      let startTime = location.opening_time;
      let endTime = location.closing_time;

      if (staffId) {
        const schedule = await prisma.staffSchedule.findFirst({
          where: { staff_id: staffId, day_of_week: dayOfWeek },
        });

        if (!schedule) return [];
        startTime = schedule.start_time;
        endTime = schedule.end_time;

        const specialAvailability =
          await prisma.staffSpecialAvailability.findUnique({
            where: {
              staff_id: staffId,
              date: date,
            },
          });

        if (specialAvailability) {
          if (!specialAvailability.is_available) return [];
          if (specialAvailability.start_time && specialAvailability.end_time) {
            startTime = specialAvailability.start_time;
            endTime = specialAvailability.end_time;
          }
        }
      }

      const selectedDate = parseISO(date);
      const [startHour, startMinute] = startTime
        .split(":" as const)
        .map(Number);
      const [endHour, endMinute] = endTime.split(":" as const).map(Number);

      const currentTime = new Date(selectedDate);
      currentTime.setHours(startHour, startMinute, 0, 0);

      const endDateTime = new Date(selectedDate);
      endDateTime.setHours(endHour, endMinute, 0, 0);

      const maxStartTime = new Date(endDateTime);
      maxStartTime.setMinutes(maxStartTime.getMinutes() - serviceDuration);

      const slots: TimeSlot[] = [];

      while (
        isBefore(currentTime, maxStartTime) ||
        currentTime.getTime() === maxStartTime.getTime()
      ) {
        const slotEndTime = addMinutes(currentTime, serviceDuration);
        slots.push({
          startTime: currentTime.toISOString(),
          endTime: slotEndTime.toISOString(),
          available: true,
        });
        currentTime.setMinutes(currentTime.getMinutes() + 30);
      }

      const appointments = await prisma.appointment.findMany({
        where: {
          location_id: locationId,
          staff_id: staffId || undefined,
          start_time: {
            gte: new Date(`${date}T00:00:00Z`),
            lte: new Date(`${date}T23:59:59Z`),
          },
          status: {
            in: ["pending", "confirmed"],
          },
        },
        select: {
          start_time: true,
          end_time: true,
        },
      });

      return slots.filter((slot) => {
        const slotStart = new Date(slot.startTime);
        const slotEnd = new Date(slot.endTime);

        for (const appointment of appointments) {
          const appointmentStart = new Date(appointment.start_time);
          const appointmentEnd = new Date(appointment.end_time);

          const overlaps =
            (slotStart >= appointmentStart && slotStart < appointmentEnd) ||
            (slotEnd > appointmentStart && slotEnd <= appointmentEnd) ||
            (slotStart <= appointmentStart && slotEnd >= appointmentEnd);

          if (overlaps) return false;
        }

        return true;
      });
    } catch (error) {
      console.error("Failed to get available time slots:", error);
      return [];
    }
  });

export const getBookingsByEmail = createServerFn({
  method: "GET",
})
  .validator((email: string) => email)
  .handler(async ({ data }) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: data,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const bookings = await prisma.appointment.findMany({
        where: {
          customer_id: user.id,
        },
        orderBy: {
          start_time: "desc",
        },
        include: {
          location: {
            select: {
              name: true,
              address: true,
              city: true,
            },
          },
          staff: {
            select: {
              name: true,
              role: true,
            },
          },
          services: {
            include: {
              locationService: {
                include: {
                  service: {
                    select: {
                      name: true,
                      duration: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const now = new Date();
      const upcoming = bookings.filter((b) => new Date(b.start_time) > now);
      const past = bookings.filter((b) => new Date(b.start_time) <= now);

      return { upcoming, past };
    } catch (error) {
      console.error("Error in getBookingsByEmail:", error);
      return {
        upcoming: [],
        past: [],
        error: "Failed to fetch bookings",
      };
    }
  });

export const cancelBooking = createServerFn({
  method: "POST",
})
  .validator((bookingId: string) => bookingId)
  .handler(async ({ data: bookingId }) => {
    try {
      const booking = await prisma.appointment.update({
        where: { id: bookingId },
        data: { status: "cancelled" },
      });
      return booking;
    } catch (error) {
      throw new Error("Failed to cancel booking");
    }
  });
