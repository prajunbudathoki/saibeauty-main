import { LocationServiceCard } from "@/components/location-service/location-service-card";
import { Input } from "@/components/ui/input";
import type { Category, LocationService } from "@/lib/type";
import { useState } from "react";

export const Services = ({
	locationServices,
	locationId: id,
	categories,
}: {
	locationServices: LocationService[];
	locationId: string;
	categories: Category[];
}) => {
	const [searchTerm, setSearchTerm] = useState("");

	const filtered = searchTerm
		? locationServices.filter((locationService) => {
				const service = locationService.service;
				if (!service) return false;
				return (
					service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					service.category?.name
						.toLowerCase()
						.includes(searchTerm.toLowerCase())
				);
			})
		: locationServices;

	return (
		<div>
			<Input
				placeholder="Search services"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="mb-4 ml-auto w-full max-w-sm"
			/>
			{filtered.length === 0 ? (
				<div className="text-center py-12">
					<h3 className="text-lg font-medium">
						No services added to this location yet
					</h3>
					<p className="text-muted-foreground">
						Add services to this location to get started.
					</p>
				</div>
			) : (
				<div className="grid gap-4">
					{filtered.map((locationService) => (
						<LocationServiceCard
							key={locationService.id}
							locationService={locationService}
							locationId={id}
						/>
					))}
				</div>
			)}
		</div>
	);
};
