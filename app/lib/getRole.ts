import { jwtDecode } from "jwt-decode";

export function getRole(jwt: string): string {
  const decoded = jwtDecode<{ user_role: string | null }>(jwt);
  const role = decoded.user_role;
  if (role) {
    return role;
  }
  return "user";
}
