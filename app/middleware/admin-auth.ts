import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [admin({ adminRoles: ["admin", "superadmin"] })],
});
