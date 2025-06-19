import prisma from "@/lib/prisma";
import { adminAuthMiddleware } from "@/middleware/admin-middleware";
import { createServerFn } from "@tanstack/react-start";
import { zfd } from "zod-form-data";

export const getEmployees = createServerFn({
  method: "GET",
})
  .middleware([adminAuthMiddleware])
  .handler(async () => {
    try {
      const employees = await prisma.user.findMany();
      return employees;
    } catch (error) {
      throw new Error("Failed to get users");
    }
  });

const createAddEmployeeSchema = zfd.formData({
  name: zfd.text(),
  email: zfd.text(),
  phone: zfd.text(),
});

export const addEmployee = createServerFn({
  method: "POST",
})
  .middleware([adminAuthMiddleware])
  .validator((d: FormData) => createAddEmployeeSchema.parse(d))
  .handler(async ({ data }) => {
    const { name, email, phone } = data;
    const employee = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        id: crypto.randomUUID(),
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "user",
      },
    });
    return employee;
  });

export const deleteEmployee = createServerFn()
  .middleware([adminAuthMiddleware])
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    if (Error) {
      console.log("Failed to delete users", Error);
      throw new Error("Failed to delete user");
    }
    await prisma.user.delete({
      where: {
        id: data,
      },
    });
  });

export const updateEmployee = createServerFn()
  .middleware([adminAuthMiddleware])
  .validator((data: { id: string; role: string }) => data)
  .handler(async ({ data }) => {
    const { id, role } = data;
    try {
      await prisma.user.update({
        where: { id },
        data: { role },
      });
    } catch (error) {
      throw new Error("Failed to update the user");
    }
  });
