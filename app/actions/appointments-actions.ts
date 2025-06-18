import { createServerFn } from "@tanstack/react-start"
import prisma from "@/lib/prisma"
import { isLoggedIn } from "./isAdmin"


// export const getAppointmentDetails = createServerFn({
//   method: "GET"
// }).validator((d: {appointmentId: string}) => d)
// .handler(async ({data: {appointmentId}}) => {
// try {
//     if (!appointmentId) {
//       return { error: "Appointment ID is required" }
//     }

//     const loggedIn = await isLoggedIn()
//     if (!loggedIn) {
//       throw new Error("User is not logged in")
//     }

//     const appointment = await prisma.appointment.findUnique({
//       where: { id: appointmentId },
//     })

//     if (!appointment) {
//       return { error: "Appointment not found" }
//     }

//     const location = await prisma.location.findUnique({
//       where: { id: appointment.location_id },
//     })


//     if (appointment.staff_id) {
//       await prisma.staff.findUnique({
//         where: { id: appointment.staff_id },
//       })
//     }

//     const services = await prisma.appointmentService.findMany({
//       where: { appointment_id: appointmentId },
//       include: {
//         locationService: {
//           include: {
//             service: true,
//           },
//         },
//       },
//     })

//     return {
//       appointment,
//       location,
//       services,
//     }
//   } catch (error) {
//     console.error("Error loading appointment details:", error)
//     return { error: "Failed to load appointment details" }
//   }
// })
 

// import { isLoggedIn } from "@/lib/auth"; // Uncomment if you have this

export const getAppointmentDetails = createServerFn({
  method: "GET",
})
  .validator((appointmentId: string) => appointmentId)
  .handler(async ({ data: appointmentId }) => {
    try {
      if (!appointmentId) {
        return { error: "Appointment ID is required" };
      }

      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          location: true,
          staff: true,
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

      if (!appointment) {
        return { error: "Appointment not found" };
      }

      return {
        appointment,
        location: appointment.location,
        staff: appointment.staff,
        services: appointment.services,
      };
    } catch (error) {
      console.error("Error loading appointment details:", error);
      return { error: "Failed to load appointment details" };
    }
  });