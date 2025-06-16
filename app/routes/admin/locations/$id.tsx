import { getLocationById } from "@/actions/location-actions";
import {
  createFileRoute,
  notFound,
  NotFoundRoute,
  Outlet,
} from "@tanstack/react-router";

export const Route = createFileRoute("/admin/locations/$id")({
  component: RouteComponent,
  beforeLoad: async ({ params }) => {
    const location = await getLocationById({ data: params.id });
    if (!location) {
      throw notFound();
    }
    return { location };
  },
});

function RouteComponent() {
  return <Outlet />;
}
