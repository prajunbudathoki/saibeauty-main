import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";
import { formData } from "zod-form-data";

export const createContact = createServerFn({
  method: "POST",
})
  .validator((d: { formData: FormData }) => d)
  .handler(async ({ data: { formData } }) => {
    try {
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const message = formData.get("message") as string;

      if (!name || !email || !phone || !message) {
        throw new Error("Required fields are missing");
      }

      const contact = await prisma.contact.create({
        data: {
          name,
          email,
          phone,
          message,
        },
      });
      return contact;
    } catch (error) {
      throw new Error("Failed to create contact");
    }
  });

export const deleteContact = createServerFn({
  method: "POST",
})
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const contact = await prisma.contact.delete({
        where: { id },
      });
      return contact;
    } catch (error) {
      throw new Error("Failed to delete contact");
    }
  });
