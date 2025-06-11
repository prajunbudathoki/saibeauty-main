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
  }
);

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
}
);