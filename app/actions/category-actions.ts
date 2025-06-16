import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { uploadFileToS3 } from "./storage.action";

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

const createCategorySchema = zfd.formData({
  name: zfd.text(),
  description: zfd.text(),
  index: zfd.numeric(),
  image: zfd.file(z.instanceof(File).optional()),
});

export const createCategory = createServerFn({
  method: "POST",
})
  .validator((d: FormData) => createCategorySchema.parse(d))
  .handler(async ({ data }) => {
    const { name, image, description, index } = data;
    // const { data: session, error } = await authClient.getSession();
    // if (session?.user.role !== "admin") {
    //   throw new Error("Role doesnot have access");
    // }
    try {
      let path: string | undefined;
      if (image) {
        path = await uploadFileToS3(image, "categories");
      }
      const category = await prisma.category.create({
        data: {
          name,
          description,
          index,
          image: path,
        },
      });
      return category;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create Category");
    }
  });

const updateCategorySchema = zfd.formData({
  id: zfd.text(),
  name: zfd.text(),
  description: zfd.text(),
  index: zfd.numeric(),
  image: zfd.file(z.instanceof(File).optional()),
});

export const updateCategory = createServerFn({
  method: "POST",
})
  .validator((d: FormData) => updateCategorySchema.parse(d))
  .handler(async ({ data }) => {
    const { id, name, description, index, image } = data;
    if (!name || !description) {
      throw new Error("Required fields are missing");
    }
    try {
      let path: string | undefined;
      if (image) {
        path = await uploadFileToS3(image, "categories");
      }
      const updateCategory = await prisma.category.update({
        where: { id },
        data: {
          name,
          description,
          image: path,
          index,
        },
      });
      return updateCategory;
    } catch (error) {
      throw new Error("Failed to update category");
    }
  });

export const deleteCategory = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data }) => {
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
          id: data,
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
