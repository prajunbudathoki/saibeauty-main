import { deleteEmployee, updateEmployee } from "@/actions/employee-actions";
import type { User } from "@/generated/prisma";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "@tanstack/react-router";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

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
      toast.success("User deleted successfully");
      router.invalidate();
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
      <Table>
        <TableHeader>
          <TableRow className="w-100">
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="relative">
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge
                  variant={user.emailVerified ? "default" : "destructive"}
                  className={`
                       max-w-[60%]
                      flex items-center justify-center gap-1 px-2 py-0.5 rounded-full text-xs
                        ${
                          user.emailVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      `}
                >
                  {user.emailVerified ? (
                    <>
                      <svg
                        className="w-3 h-3 mr-1 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <title>as</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Verified
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3 h-3 mr-1 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <title>as</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Not Verified
                    </>
                  )}
                </Badge>
              </TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
