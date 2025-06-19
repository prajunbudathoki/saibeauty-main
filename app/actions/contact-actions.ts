import prisma from "@/lib/prisma";
import { adminAuthMiddleware } from "@/middleware/admin-middleware";
import { createServerFn } from "@tanstack/react-start";
import { formData, zfd } from "zod-form-data";

const createContactSchema = zfd.formData({
  name: zfd.text(),
  email: zfd.text(),
  phone: zfd.text(),
  message: zfd.text(),
});

export const createContact = createServerFn({
  method: "POST",
})
  .middleware([adminAuthMiddleware])
  .validator((d: FormData) => createContactSchema.parse(d))
  .handler(async ({ data }) => {
    const { name, email, message, phone } = data;
    try {
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
  .middleware([adminAuthMiddleware])
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
