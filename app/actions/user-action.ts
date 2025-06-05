import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";
import bcrypt from "bcryptjs";

export const updateUserInfo = createServerFn({
  method: "POST",
})
  .validator((d: { userId: string; name: string; phone: string; password?: string }) => d)
  .handler(async ({ data }) => {
    const { userId, name, phone, password } = data;
    const updateData: { name: string; phone: string; password?: string } = {
      name,
      phone,
    };
    if (password && password.length > 0) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, name: true, phone: true, email: true },
    });

    return { success: true, user };
  });