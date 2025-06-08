import { createFileRoute } from "@tanstack/react-router";
import { Services } from "@/components/location-service/services";
import { getLocationServices } from "@/actions/location-service-actions";
import { getCategories } from "@/actions/category-actions";

export const Route = createFileRoute("/admin/locations/$id/services/search")({
	loader: async ({ params }) => {
		const locationId = params.id;
		const locationServices = await getLocationServices({ data: locationId });
		const categories = await getCategories();
		return { locationServices, locationId, categories };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { locationServices, locationId, categories } = Route.useLoaderData();
	return (
		<Services
			locationServices={locationServices}
			locationId={locationId}
			categories={categories}
		/>
	);
}
