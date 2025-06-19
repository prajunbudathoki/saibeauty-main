import { createServerFn } from "@tanstack/react-start"
import prisma from "@/lib/prisma"

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