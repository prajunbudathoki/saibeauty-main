import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";
import { zfd } from "zod-form-data";
import { uploadFileToS3 } from "./storage.action";

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

const createGalleryItemSchema = zfd.formData({
  title: zfd.text(),
  description: zfd.text(),
  image: zfd.file(),
});

export const createGalleryItem = createServerFn({
  method: "POST",
})
  .validator((d: FormData) => createGalleryItemSchema.parse(d))
  .handler(async ({ data }) => {
    const { title, description, image } = data;
    try {
      const path = await uploadFileToS3(image, "gallery");
      const galleryItem = await prisma.galleryItem.create({
        data: {
          title,
          description,
          image: path,
        },
      });
      return galleryItem;
    } catch (error) {
      throw new Error("Failed to create Gallery Item");
    }
  });

const updateGalleryItemSchema = zfd.formData({
  id: zfd.text(),
  title: zfd.text(),
  description: zfd.text(),
  image: zfd.file(),
});

export const updateGalleryItem = createServerFn({
  method: "POST",
})
  .validator((d: FormData) => updateGalleryItemSchema.parse(d))
  .handler(async ({ data }) => {
    const { id, title, description, image } = data;
    try {
      const path = await uploadFileToS3(image, "gallery ");
      const galleryItem = await prisma.galleryItem.update({
        where: {
          id,
        },
        data: {
          title,
          description,
          image: path,
        },
      });
      return galleryItem;
    } catch (error) {
      throw new Error("Failed to update Gallery Item");
    }
  });

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
