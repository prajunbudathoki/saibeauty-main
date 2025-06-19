import { createMiddleware } from "@tanstack/react-start";
import { getEvent } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";

export const adminAuthMiddleware = createMiddleware().server(
  async ({ next }) => {
    const event = getEvent();
    const session = await auth.api.getSession({
      headers: event.headers,
    });
    if (!session || session.user.role !== "admin") {
        throw new Error("Role doesnot have permission");
    }
    return await next();
  }
);
