import { getCategories } from "@/actions/category-actions";
import { getLocationById } from "@/actions/location-actions";
import { getLocationServices } from "@/actions/location-service-actions";
import { LocationServiceDialog } from "@/components/location-service/location-service-dialog";
import { Services } from "@/components/location-service/services";
import { AdminHeader } from "@/components/shared/admin-header";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/locations/$id/services/")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const [location, locationServices, categories] = await Promise.all([
			getLocationById({ data: params.id }),
			getLocationServices({ data: params.id }),
			getCategories(),
		]);
		const locationId = params.id;
		return { location, locationServices, categories, locationId };
	},
});

function RouteComponent() {
	const { location, locationServices, categories, locationId } =
		Route.useLoaderData();
	return (
		<div>
			<AdminHeader title={`${location.name} - Services`} />
			<div className="container py-6">
				<div className="flex justify-between items-center mb-6">
					<div className="flex items-center gap-2">
						<Button asChild variant="outline" size="icon" className="h-8 w-8">
							<Link to={"/admin/locations"}>
								<ArrowLeft className="h-4 w-4" />
							</Link>
						</Button>
						<h2 className="text-lg font-medium">
							Services for {location.name}
						</h2>
					</div>

					<LocationServiceDialog
						locationId={locationId}
						title="Add Service"
						categories={categories}
						trigger={
							<Button>
								<Plus className="h-4 w-4 mr-2" />
								Add Service
							</Button>
						}
					/>
				</div>
				<Services
					locationServices={locationServices}
					locationId={locationId}
					categories={categories}
				/>
			</div>
		</div>
	);
}
