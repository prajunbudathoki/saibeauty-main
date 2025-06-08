import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";

export const getStaffSpecialAvailability = createServerFn({
  method: "GET",
})
  .validator(
    (staffId: string, locationId: string, month: number, year: number) => ({
      staffId,
      locationId,
      month,
      year,
    })
  )
  .handler(async ({ data: { staffId, locationId, month, year } }) => {
    try {
      const specialAvailability =
        await prisma.staffSpecialAvailability.findMany({
          where: {
            staff_id: staffId,
            location_id: locationId,
            date: {
              gte: new Date(year, month - 1, 1).toISOString().split("T")[0],
              lt: new Date(year, month, 1).toISOString().split("T")[0],
            },
          },
          orderBy: [{ date: "asc" }],
        });
      return specialAvailability;
    } catch (error) {
      throw new Error("Failed to fetch special availability for staff");
    }
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

// type Input =
//   | { staffId: string; locationId: string; date: string }
//   | { staffId: string; locationId: string; month: number; year: number };

// export const getStaffSpecialAvailability = createServerFn({
//   method: "GET",
// })
//   .validator((input: Input) => input)
//   .handler(async ({ data }) => {
//     try {
//       if ("date" in data) {
//         // Fetch for a specific date
//         const special = await prisma.staffSpecialAvailability.findFirst({
//           where: {
//             staff_id: data.staffId,
//             location_id: data.locationId,
//             date: new Date(data.date),
//           },
//         });
//         return special ? [special] : [];
//       } else if ("month" in data && "year" in data) {
//         // Fetch for a month
//         const startDate = new Date(data.year, data.month - 1, 1);
//         const endDate = new Date(data.year, data.month, 0, 23, 59, 59, 999);
//         const specials = await prisma.staffSpecialAvailability.findMany({
//           where: {
//             staff_id: data.staffId,
//             location_id: data.locationId,
//             date: {
//               gte: startDate,
//               lte: endDate,
//             },
//           },
//           orderBy: [{ date: "asc" }],
//         });
//         return specials;
//       } else {
//         throw new Error("Invalid input");
//       }
//     } catch (error) {
//       throw new Error("Failed to fetch staff special availability");
//     }
//   });
