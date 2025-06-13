import { deleteEmployee, updateEmployee } from "@/actions/employee-actions";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Router, Trash } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import type { User } from "@/generated/prisma";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";

export function UserTable({ users }: { users: User[] }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.user) {
      setCurrentUser(session.user as User);
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployee({ data: id });
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleRoleToggle = async (id: string, currentRole: string) => {
    try {
      const newRole = currentRole === "admin" ? "moderator" : "admin";
      await updateEmployee({ data: { id, role: newRole } });
      toast.success("Role updated successfully");
      router.invalidate();
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  return (
    <div className="border rounded-lg container mx-auto p-4">
      <Table >
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableHead>{user.email}</TableHead>
              <TableHead>{user.role}</TableHead>
              <TableHead>
                {currentUser && currentUser.email !== user.email ? (
                  <div className="flex gap-2 items-center">
                    <Button
                      size="icon"
                      variant={"destructive"}
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash />
                    </Button>
                    <Button
                      onClick={() =>
                        handleRoleToggle(user.id, user?.role ?? "user")
                      }
                    >
                      Change To {user.role === "admin" ? "Moderator" : "Admin"}
                    </Button>
                  </div>
                ) : null}
              </TableHead>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
