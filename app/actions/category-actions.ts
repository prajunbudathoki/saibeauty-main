import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";

export const getCategories = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        index: "asc",
      },
    });
    return categories;
  } catch (error) {
    throw new Error("Failed to fetch categories");
  }
});

export const getCategoryById = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    return await prisma.category.findUnique({
      where: {
        id: data,
      },
    });
  });

export const createCategory = createServerFn({
  method: "POST",
})
  .validator(
    (data: { name: string; description?: string; index: number }) => data
  )
  .handler(async ({ data: { name, description, index } }) => {
    // const { data: session, error } = await authClient.getSession();
    // if (session?.user.role !== "admin") {
    //   throw new Error("Role doesnot have access");
    // }
    try {
      return await prisma.category.create({
        data: {
          name,
          description,
          index,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create Category");
    }
  });

export const deleteCategory = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    const { id } = data;
    // const { data: session, error } = await authClient.getSession();
    // if (session?.user.role !== "admin") {
    //   throw new Error("Role doesnot have access");
    // }
    // if (error) {
    //   console.log("Error occured while deleting", error);
    //   throw new Error("Failed to delete the Category");
    // }
    try {
      await prisma.category.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error("Failed to delete Category");
    }
  });

export const getCategoryServiceCount = createServerFn({
  method: "GET",
})
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    const category = await prisma.service.count({
      where: {
        id: data,
      },
    });
    return category;
  });

export const getCategoriesWithServiceCount = createServerFn().handler(
  async () => {
    return await prisma.category.findMany({
      include: {
        services: {
          select: {
            id: true,
          },
        },
      },
    });
  }
);
