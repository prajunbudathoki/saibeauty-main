import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";

export const getGalleryItems = createServerFn({
  method: "POST",
}).handler(async () => {
  try {
    const gallery = await prisma.galleryItem.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    return gallery;
  } catch (error) {
    throw new Error("Failed to load gallery");
  }
});

export const getGalleryItemById = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    return await prisma.galleryItem.findUnique({
      where: {
        id: data,
      },
    });
  });

export const createGalleryItem = createServerFn({
  method: "POST",
})
  .validator((d: { formData: FormData }) => d)
  .handler(async ({ data }) => {
    const { formData } = data;
    try {
      const galleryItem = await prisma.galleryItem.create({
        data: {
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          image: formData.get("image") as string,
        },
      });
      return galleryItem;
    } catch (error) {
      throw new Error("Failed to create Gallery Item");
    }
  });

export const updateGalleryItem = createServerFn({
  method: "POST",
})
  .validator((d: { id: string; formData: FormData }) => d)
  .handler(async ({ data }) => {
    const { id, formData } = data;
    try {
      const galleryItem = await prisma.galleryItem.update({
        where: { id },
        data: {
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          image: formData.get("image") as string,
        },
      });
      return galleryItem;
    } catch (error) {
      throw new Error("Failed to update Gallery Item");
    }
  }
);  

export const deleteGalleryItem = createServerFn({
  method: "POST",
})
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    try {
      await prisma.galleryItem.delete({
        where: { id: data },
      });
    } catch (error) {
      throw new Error("Failed to delete Gallery Item");
    }
  });

    