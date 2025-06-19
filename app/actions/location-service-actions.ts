import prisma from "@/lib/prisma";
import { adminAuthMiddleware } from "@/middleware/admin-middleware";
import { createServerFn } from "@tanstack/react-start";

export const getLocationServices = createServerFn({
  method: "GET",
})
  .validator((locationId: string) => locationId)
  .handler(async ({ data: locationId }) => {
    try {
      const locationServices = await prisma.locationService.findMany({
        where: { location_id: locationId },
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
        orderBy: [
          { service: { category: { index: "asc" } } },
          { service: { index: "asc" } },
        ],
      });
      return locationServices;
    } catch (error) {
      throw new Error("Failed to fetch location srvices");
    }
  });

export const addServiceToLocation = createServerFn({
  method: "POST",
})
  .middleware([adminAuthMiddleware])
  .validator((d: { formData: FormData }) => d)
  .handler(async ({ data }) => {
    const existingService = await prisma.locationService.findFirst({
      where: {
        location_id: data.formData.get("location_id") as string,
        service_id: data.formData.get("service_id") as string,
      },
    });

    if (existingService) {
      throw new Error("This service is already added to this location");
    }

    try {
      const locationService = await prisma.locationService.create({
        data: {
          location_id: data.formData.get("location_id") as string,
          service_id: data.formData.get("service_id") as string,
          price: data.formData.get("price")
            ? Number(data.formData.get("price"))
            : null,
        },
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      });
      return locationService;
    } catch (error) {
      throw new Error("Failed to add service to location");
    }
  });

export const updateLocationService = createServerFn({
  method: "POST",
})
  .middleware([adminAuthMiddleware])
  .validator((input: { id: string; form: Record<string, any> }) => input)
  .handler(async ({ data: { id, form } }) => {
    const { location_id, price } = form;

    if (!location_id) {
      throw new Error("Location id is required");
    }

    try {
      const locationService = await prisma.locationService.update({
        where: { id },
        data: {
          price: price !== undefined && price !== null ? Number(price) : null,
        },
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      });

      return locationService;
    } catch (error) {
      throw new Error("Failed to update location service");
    }
  });

export const removeServiceFromLocation = createServerFn({
  method: "POST",
})
  .middleware([adminAuthMiddleware])
  .validator((input: { id: string; locationId: string }) => input)
  .handler(async ({ data: { id, locationId } }) => {
    try {
      await prisma.locationService.delete({
        where: { id },
      });
      return;
    } catch (error) {
      throw new Error("Failed to remove service from location");
    }
  });

export const getAvailableServices = createServerFn({
  method: "GET",
})
  .validator((input: { locationId: string; categoryId: string }) => input)
  .handler(async ({ data: { locationId, categoryId } }) => {
    try {
      const existingServices = await prisma.locationService.findMany({
        where: {
          location_id: locationId,
          service: { category_id: categoryId },
        },
        select: { service_id: true },
      });

      const existingServiceIds = existingServices.map(
        (item) => item.service_id
      );

      const services = await prisma.service.findMany({
        where: {
          category_id: categoryId,
          NOT:
            existingServiceIds.length > 0
              ? existingServiceIds.map((id) => ({ id }))
              : undefined,
        },
        include: {
          category: { select: { name: true } },
        },
        orderBy: { name: "asc" },
      });

      return services;
    } catch (error) {
      throw new Error("Failed to fetch available services");
    }
  });
