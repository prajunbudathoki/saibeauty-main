import { sendEmail } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { TimeSlot } from "@/lib/type";
import { createServerFn } from "@tanstack/react-start";
import {
  addMinutes,
  endOfDay,
  getDay,
  isBefore,
  parseISO,
  setHours,
  setMinutes,
  startOfDay,
} from "date-fns";
import { isLoggedIn } from "./isAdmin";
import { auth } from "@/lib/auth";
import { getEvent } from "@tanstack/react-start/server";
import { getHeaders } from "@tanstack/react-start/server";
import type {
  Staff,
  StaffSchedule,
  StaffSpecialAvailability,
} from "@/generated/prisma";

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
              locationServices: true,
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
    const weekday = new Date(date).getDay();
    try {
      const staffs = await prisma.staff.findMany({
        where: {
          location_id: locationId,
          is_available_for_booking: true,
        },
        include: {
          StaffSchedule: true,
          StaffSpecialAvailability: {
            where: {
              date: parseISO(date),
              is_available: true,
            },
          },
        },

        orderBy: [{ index: "asc" }, { name: "asc" }],
      });
      return staffs.filter(
        (
          staff: Staff & {
            StaffSchedule: StaffSchedule[];
            StaffSpecialAvailability: StaffSpecialAvailability[];
          }
        ) => {
          const isAvailableOnDay = staff.StaffSchedule.some(
            (schedule) => schedule.day_of_week === weekday
          );
          if (staff.StaffSpecialAvailability.length > 0) {
            const specialAvailability = staff.StaffSpecialAvailability[0];
            if (!specialAvailability.is_available) {
              return false;
            }
            if (
              specialAvailability.start_time &&
              specialAvailability.end_time
            ) {
              const startTime = new Date(specialAvailability.start_time);
              const endTime = new Date(specialAvailability.end_time);
              const selectedDate = new Date(date);
              if (selectedDate >= startTime || selectedDate <= endTime) {
                return true;
              }
            }
          }
          if (!isAvailableOnDay) {
            return false;
          }
          return true;
        }
      );
    } catch (error) {
      throw new Error("Failed to fetch available staff members");
    }
  });

export const createAppointment = createServerFn()
  .validator((d: FormData) => d)
  .handler(async ({ data: formData }) => {
    try {
      const event = getEvent();
      const session = await auth.api.getSession({
        headers: event.headers,
      });
      if (!session?.user?.id) {
        throw new Error("User is not authenticated");
      }

      const customer_id = session?.user.id;

      const location_id = formData.get("location_id") as string;
      const staff_id = formData.get("staff_id") as string | null;
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
      console.log(
        location_id,
        start_time,
        end_time,
        customer_name,
        customer_email,
        serviceIds.length === 0
      );
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

      const appointment = await prisma.appointment.create({
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
      });
      await sendEmail({
        to: customer_email,
        subject: "Your Appointment is Confirmed",
        text: `Hi ${customer_name},\n\nThank you for booking your appointment at Sai Beauty Salon!\nYour appointment is on ${start_time}.\n\nSee you soon!`,
        html: `<p>Hi ${customer_name},</p>
               <p>Thank you for booking your appointment at <b>Sai Beauty Salon</b>!</p>
               <p>Your appointment is on <b>${start_time}</b>.</p>
               <p>See you soon!</p>`,
      });
      return appointment;
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      throw new Error("Failed to create appointment");
    }
  });

export const getAvailableTimeSlots = createServerFn({
  method: "POST",
})
  .validator((form: Record<string, any>) => form)
  .handler(async ({ data }) => {
    const { locationId, staffId, date, totalDuration } = data;
    const dayOfWeek = new Date(date).getDay();
    const location = await prisma.location.findUnique({
      where: { id: locationId },
    });

    if (!location) return [];

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    if (isWeekend && !location.is_open_on_weekends) return [];

    let startTime = location.opening_time;
    let endTime = location.closing_time;

    if (staffId) {
      const schedule = await prisma.staffSchedule.findFirst({
        where: {
          staff_id: staffId,
          location_id: locationId,
        },
        orderBy: {
          day_of_week: "asc",
        },
      });

      if (!schedule) {
        return [];
      }
      startTime = schedule.start_time;
      endTime = schedule.end_time;

      const specialAvailability =
        await prisma.staffSpecialAvailability.findFirst({
          where: {
            staff_id: staffId,
            date: parseISO(date),
          },
        });

      if (specialAvailability) {
        if (!specialAvailability.is_available) {
          return [];
        }

        if (specialAvailability.start_time && specialAvailability.end_time) {
          startTime = specialAvailability.start_time;
          endTime = specialAvailability.end_time;
        }
      }
    }

    const slots: TimeSlot[] = [];
    const selectedDate = parseISO(date);

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    let current = setMinutes(setHours(selectedDate, startHour), startMinute);
    const end = setMinutes(setHours(selectedDate, endHour), endMinute);

    const maxStart = addMinutes(end, -totalDuration);

    while (isBefore(current, maxStart) || +current === +maxStart) {
      const slotEnd = addMinutes(current, totalDuration);
      slots.push({
        startTime: current.toISOString(),
        endTime: slotEnd.toISOString(),
        available: true,
      });
      current = addMinutes(current, 30);
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        location_id: locationId,
        staff_id: staffId,
        start_time: {
          gte: startOfDay(parseISO(date)),
          lte: endOfDay(parseISO(date)),
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
    console.log("Generated slots:", slots.length);
    console.log("Appointments fetched:", appointments.length);

    return slots.filter((slot) => {
      const slotStart = new Date(slot.startTime);
      const slotEnd = new Date(slot.endTime);

      for (const appointment of appointments) {
        const aStart = new Date(appointment.start_time);
        const aEnd = new Date(appointment.end_time);

        if (
          (slotStart >= aStart && slotStart < aEnd) ||
          (slotEnd > aStart && slotEnd <= aEnd) ||
          (slotStart <= aStart && slotEnd >= aEnd)
        ) {
          return false;
        }
      }

      return true;
    });
  });

// export const getBookingsByEmail = createServerFn({
//   method: "GET",
// })
//   .validator((d: { email: string }) => d)
//   .handler(async ({ data }) => {
//     const { email } = data;
//     try {
//       const user = await prisma.user.findUnique({
//         where: {
//           email,
//         },
//         select: {
//           id: true,
//         },
//       });

//       if (!user) {
//         throw new Error("User not found");
//       }

//       const bookings = await prisma.appointment.findMany({
//         where: {
//           customer_id: user.id,
//         },
//         orderBy: {
//           start_time: "desc",
//         },
//         include: {
//           location: {
//             select: {
//               name: true,
//               address: true,
//               city: true,
//             },
//           },
//           staff: {
//             select: {
//               name: true,
//               role: true,
//             },
//           },
//           services: {
//             include: {
//               locationService: {
//                 include: {
//                   service: {
//                     select: {
//                       name: true,
//                       duration: true,
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       });

//       const now = new Date();
//       const upcoming = bookings.filter((b) => new Date(b.start_time) > now);
//       const past = bookings.filter((b) => new Date(b.start_time) <= now);

//       return { upcoming, past };
//     } catch (error) {
//       console.error("Error in getBookingsByEmail:", error);
//       return {
//         upcoming: [],
//         past: [],
//         error: "Failed to fetch bookings",
//       };
//     }
//   });

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

export const getMyBookings = createServerFn({
  method: "POST",
}).handler(async () => {
  const event = getEvent();
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  if (!session?.user?.id) {
    throw new Error("User is not authenticated");
  }

  try {
    const bookings = await prisma.appointment.findMany({
      where: {
        customer_id: session.user.id,
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
    console.error("Error fetching user bookings:", error);
    return { upcoming: [], past: [] };
  }
});
