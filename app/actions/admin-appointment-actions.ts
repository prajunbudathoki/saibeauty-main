import { createServerFn } from "@tanstack/react-start";
import prisma from "@/lib/prisma";

export const getAppointments = createServerFn({
  method: "GET",
})
  .validator(
    (filters?: {
      startDate?: string;
      endDate?: string;
      status?: string;
      locationId?: string;
      staffId?: string;
      search?: string;
    }) => filters
  )
  .handler(async ({ data: filters }) => {
    try {
      const where: any = {};

      if (filters) {
        if (filters.startDate) {
          where.start_time = { gte: new Date(filters.startDate) };
        }
        if (filters.endDate) {
          where.start_time = {
            ...(where.start_time || {}),
            lte: new Date(filters.endDate),
          };
        }
        if (filters.status) {
          where.status = filters.status;
        }
        if (filters.locationId) {
          where.location_id = filters.locationId;
        }
        if (filters.staffId) {
          where.staff_id = filters.staffId;
        }
        if (filters.search) {
          where.OR = [
            { customer_name: { contains: filters.search } },
            { customer_email: { contains: filters.search } },
            { customer_phone: { contains: filters.search } },
          ];
        }
      }

      const appointments = await prisma.appointment.findMany({
        where,
        orderBy: { start_time: "desc" },
        include: {
          location: { select: { name: true } },
          staff: { select: { name: true } },
        },
      });
      console.log("Fetched appointments:", appointments);

      return appointments;
    } catch (error) {
      console.error("Exception fetching appointments:", error);
    }
  });

export const getAppointmentById = createServerFn({
  method: "GET",
})
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    try {
      return await prisma.appointment.findUnique({
        where: { id: data },
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
    } catch (error) {
      throw new Error("Failed to fetch appointment");
    }
  });

export const updateAppointmentStatus = createServerFn({
  method: "POST",
})
  .validator((input: { id: string; status: string }) => input)
  .handler(async ({ data: { id, status } }) => {
    try {
      const currentAppointment = await prisma.appointment.findUnique({
        where: { id },
        include: {
          location: true,
          staff: true,
        },
      });

      if (!currentAppointment) {
        throw new Error("Appointment not found");
      }

      // Allowed status values as per Prisma enum
      const allowedStatuses = [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "no_show",
      ] as const;
      type AppointmentStatus = (typeof allowedStatuses)[number];

      if (!allowedStatuses.includes(status as AppointmentStatus)) {
        throw new Error("Invalid status value");
      }

      const updatedAppointment = await prisma.appointment.update({
        where: { id },
        data: {
          status: status as AppointmentStatus,
          updated_at: new Date(),
        },
        include: {
          location: true,
          staff: true,
        },
      });
      return updatedAppointment;
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  });

export const rescheduleAppointment = createServerFn({
  method: "POST",
})
  .validator(
    (input: { id: string; startTime: string; endTime: string }) => input
  )
  .handler(async ({ data: { id, startTime, endTime } }) => {
    try {
      const currentAppointment = await prisma.appointment.findUnique({
        where: { id },
        include: {
          location: true,
          staff: true,
        },
      });

      if (!currentAppointment) {
        throw new Error("Failed to fetch appointment");
      }

      const updatedAppointment = await prisma.appointment.update({
        where: { id },
        data: {
          start_time: new Date(startTime),
          end_time: new Date(endTime),
          updated_at: new Date(),
        },
        include: {
          location: true,
          staff: true,
        },
      });
      return updatedAppointment;
    } catch (error) {
      throw new Error("Failed to reschedule appointment");
    }
  });

export const assignStaffToAppointment = createServerFn({
  method: "POST",
})
  .validator((input: { id: string; staffId: string }) => input)
  .handler(async ({ data: { id, staffId } }) => {
    try {
      const currentAppointment = await prisma.appointment.findUnique({
        where: { id },
        include: { location: true, staff: true },
      });

      if (!currentAppointment) {
        throw new Error("Failed to fetch appointment");
      }

      const staffData = await prisma.staff.findUnique({
        where: { id: staffId },
      });

      if (!staffData) {
        throw new Error("Failed to fetch staff");
      }

      const updatedAppointment = await prisma.appointment.update({
        where: { id },
        data: {
          staff_id: staffId,
          updated_at: new Date(),
        },
        include: { location: true, staff: true },
      });

      return updatedAppointment;
    } catch (error) {
      throw new Error("Failed to assign staff to appointment");
    }
  });

export const deleteAppointment = createServerFn({
  method: "POST",
})
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: {
          location: true,
          staff: true,
        },
      });

      if (!appointment) {
        throw new Error("Failed to fetch appointment");
      }

      await prisma.appointmentService.deleteMany({
        where: { appointment_id: id },
      });
      await prisma.appointment.delete({
        where: { id },
      });
      return;
    } catch (error) {
      throw new Error("Failed to delete appointment");
    }
  });

export const getAppointmentStats = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const todayCount = await prisma.appointment.count({
      where: {
        start_time: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const upcomingCount = await prisma.appointment.count({
      where: {
        start_time: {
          gte: today,
          lt: nextWeek,
        },
      },
    });

    const pendingCount = await prisma.appointment.count({
      where: {
        status: "pending",
      },
    });

    const totalCount = await prisma.appointment.count();

    return {
      today: todayCount,
      upcoming: upcomingCount,
      pending: pendingCount,
      total: totalCount,
    };
  } catch (error) {
    throw new Error("Failed to fetch appointment stats");
  }
});

export const getAdminDashboardData = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const [
      locationCount,
      categoryCount,
      serviceCount,
      galleryItemCount,
      testimonialCount,
      contactCount,
      appointmentStats,
      recentLocations,
      recentContacts,
      recentServices,
      recentTestimonials,
    ] = await Promise.all([
      prisma.location.count(),
      prisma.category.count(),
      prisma.service.count(),
      prisma.testimonial.count(),
      prisma.contact.count(),
      prisma.galleryItem.count(),
      getAppointmentStats(),
      prisma.location.findMany({ orderBy: { created_at: "desc" }, take: 3 }),
      prisma.contact.findMany({ orderBy: { created_at: "desc" }, take: 3 }),
      prisma.service.findMany({ orderBy: { created_at: "desc" }, take: 3 }),
      prisma.testimonial.findMany({ orderBy: { created_at: "desc" }, take: 3 }),
    ]);

    return {
      dashstats: {
        locationCount,
        categoryCount,
        serviceCount,
        galleryItemCount,
        testimonialCount,
        contactCount,
        appointmentStats,
      },
      dashrecents: {
        recentLocations,
        recentContacts,
        recentServices,
        recentTestimonials,
      },
    };
  } catch (error) {
    throw new Error("Failed to fetch dashboard data");
  }
});
