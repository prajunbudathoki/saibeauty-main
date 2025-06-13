import { authClient } from "@/lib/auth-client";
import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";
import { zfd } from "zod-form-data";

export const getEmployees = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    // const { data: session, error } = await authClient.getSession();
    // if (session?.user.role !== "admin") {
    //   throw new Error("Role doesnot have access");
    // }
    const employees = await prisma.user.findMany({
      where: {
        role: "user",
      },
    });
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
  .validator((d: FormData) => createAddEmployeeSchema.parse(d))
  .handler(async ({ data }) => {
    const { name, email, phone } = data;
    // const { data: session, error } = await authClient.getSession();
    // if (session?.user.role !== "admin") {
    //   throw new Error("Role doesnot have access");
    // }
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
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    const { data: session, error } = await authClient.getSession();
    if (session?.user.role !== "admin") {
      throw new Error("Role doesnot have access");
    }
    if (error) {
      console.log("Failed to delete users", error);
      throw new Error("Failed to delete user");
    }
    await prisma.user.delete({
      where: {
        id: data,
      },
    });
  });

export const updateEmployee = createServerFn()
  .validator((data: { id: string; role: string }) => data)
  .handler(async ({ data }) => {
    const { id, role } = data;
    try {
      // const { data: session, error } = await authClient.getSession();
      // if (session?.user.role !== "admin") {
      //   throw new Error("Role doesnot have access");
      // }
      await prisma.user.update({
        where: { id },
        data: { role },
      });
    } catch (error) {
      throw new Error("Failed to update the user");
    }
  });
