import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: "http://localhost:3000",
  plugins: [adminClient(), inferAdditionalFields<typeof auth>()],
});

export const { useSession } = authClient;
