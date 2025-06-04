import prisma from "@/lib/prisma";
import { useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const submitReview = createServerFn({
  method: "POST",
})
  .validator(
    (d: { appointmentId: string; rating: number; review: string }) => d
  )
  .handler(async ({ data: { appointmentId, rating, review } }) => {
    const navigate = useNavigate();
    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { rating, review },
    });
    navigate({ to: "/profile/booking" });
    return updated;
  });

export const getStaffReviews = createServerFn({
  method: "GET",
})
  .validator((d: { staffId: string }) => d)
  .handler(async ({ data: { staffId } }) => {
    await prisma.appointment.findMany({
      where: {
        staff_id: staffId,
        status: "completed",
        NOT: { rating: null },
      },
      select: {
        id: true,
        rating: true,
        review: true,
        customer_name: true,
        created_at: true,
        start_time: true,
      },
      orderBy: { start_time: "desc" },
    });
  });

export const getStaffAverageRating = createServerFn({
  method: "GET",
})
  .validator((d: { staffId: string }) => d)
  .handler(async ({ data: { staffId } }) => {
    const ratings = await prisma.appointment.findMany({
      where: { staff_id: staffId, status: "completed", NOT: { rating: null } },
      select: {
        rating: true,
      },
    });
    if (!ratings.length) {
      return { averageRating: null, totalReviews: null };
    }
    const totalRating = ratings.reduce(
      (sum, appointment) => sum + (appointment.rating || 0),
      0
    );
    const averageRating = totalRating / ratings.length;

    return {
      averageRating: Number.parseFloat(averageRating.toFixed(1)),
      totalReviews: ratings.length,
    };
  });
