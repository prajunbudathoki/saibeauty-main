import { useSession } from "@/lib/auth-client";
import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";

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
      });
      return services;
    } catch (error) {
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
        !location_id||
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
