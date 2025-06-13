import { getEmployees } from "@/actions/employee-actions";
import { AddUser } from "@/components/users/add-user";
import { UserTable } from "@/components/users/users-table";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users/")({
  component: RouteComponent,
  loader: async () => {
    const users = await getEmployees();
    return users;
  },
});

function RouteComponent() {
  const users = Route.useLoaderData();
  return (
    <div className="my-10 space-y-4">
      <h1 className="text-2xl font-bold container mx-auto">Users Management</h1>
      <AddUser />
      <UserTable users={users} />
    </div>
  );
}
