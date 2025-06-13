import { getEmployees } from "@/actions/employee-actions";
import { AddEmployee } from "@/components/employees/add-employee";
import { createFileRoute } from "@tanstack/react-router";
;

export const Route = createFileRoute("/admin/employees/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/admin/employees/"!</div>;
}
