import { AdminHeader } from "@/components/shared/admin-header";
import { AdminSidebar } from "@/components/shared/admin-sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  console.log("Hello from layout page");
  return (
    <>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 transition-all duration-300 ease-in-out">
          <Outlet />
        </main>
      </div>
    </>
  );
}
