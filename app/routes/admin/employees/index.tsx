import { getEmployees } from "@/actions/employee-actions";
import { AddEmployee } from "@/components/employees/add-employee";

async function Page() {
  const employees = await getEmployees();

  return (
    <div className="my-10 space-y-4">
      <h1 className="text-2xl font-bold container mx-auto">
        Employee Management
      </h1>
      <AddEmployee />
      <EmployeeTable employees={employees} />
    </div>
  );
}

export default Page;
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/employees/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/admin/employees/"!</div>;
}
