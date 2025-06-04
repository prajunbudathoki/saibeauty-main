import { authClient } from "@/lib/auth-client";
import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";

export const getEmployees = createServerFn({
  method: "GET",
}).handler(async () => {
  const { data: session, error } = await authClient.getSession();
  if (session?.user.role !== "admin") {
    throw new Error("Role doesnot have access");
  }
  if (error) {
    console.log("Failed to fetch Employess", error);
    throw new Error("Failed to fetch employees");
  }
  const employees = await prisma.user.findMany({
    where: {
      role: "user",
    },
  });
  return employees;
});

export const addEmployee = createServerFn({
  method: "POST",
})
  .validator((d: { name: string; email: string; phone: string }) => d)
  .handler(async ({ data: { name, email, phone } }) => {
    const { data: session, error } = await authClient.getSession();
    if (session?.user.role !== "admin") {
      throw new Error("Role doesnot have access");
    }
    if (error) {
      console.log("Failed to add employee", error);
      throw new Error("Failed to add employee");
    }
    const employee = await prisma.user.create({
      data: {
        name,
        email,
        phone,
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

// export const updateEmployee = createServerFn()
//   .validator((id: string) => id)
//   .handler(async () => {
//     const { data: session, error } = await authClient.getSession();
//     if (session?.user.role !== "admin") {
//       throw new Error("Role doesnot have access");
//     }
//     if (error) {
//       console.log("Error updating employee", error);
//       throw new Error("Failed to update employee");
//     }
//     await prisma.user.update({
//       where: {
//         role: ,
//       },
//     });
//   });
