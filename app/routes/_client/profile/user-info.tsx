import { UserSidebar } from "@/components/shared/user-sidebar";
import { useSession } from "@/lib/auth-client";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_client/profile/user-info")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSession();
  return (
    <div>
      <UserSidebar />
      <h1>Hello{data?.user.name}</h1>
    </div>
  );
}
