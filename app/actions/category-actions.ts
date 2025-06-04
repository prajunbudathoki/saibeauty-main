import { authClient } from "@/lib/auth-client";
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

export const deleteCategory = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    const { data: session, error } = await authClient.getSession();
    if (session?.user.role !== "admin") {
      throw new Error("Role doesnot have access");
    }
    if (error) {
      console.log("Error occured while deleting", error);
      throw new Error("Failed to delete the Category");
    }
    await prisma.category.delete({
      where: { id: data },
    });
  });

// export const getCategoryServiceCount = createServerFn({
//     method:"GET"
// }).handler(async ({params}) => {
//     const category = await prisma.service.count({
//         where: {
//             category_id: params.categoryId
//         }
//     })
// })