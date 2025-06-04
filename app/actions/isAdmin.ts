import prisma from "@/lib/prisma";
import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { getRole } from "@/lib/getRole";

export async function isAdmin() {
    const { data: session,error } = await authClient.getSession()
    if(error) {
        return false
    }
    if(!session){
        return false
    }
    const token = session.session.token
    const role= getRole(token)
    return role === "admin"
}