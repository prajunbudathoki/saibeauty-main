import { NotFound } from "@/components/not-found";
import { AdminHeader } from "@/components/shared/admin-header";
import { AdminSidebar } from "@/components/shared/admin-sidebar";
import { useSession } from "@/lib/auth-client";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session } = useSession();
  if (!session) {
    return;
  }
  if (
    !session.user ||
    !["admin", "superadmin"].includes(session.user.role ?? "")
  ) {
    return <NotFound />;
  }
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
