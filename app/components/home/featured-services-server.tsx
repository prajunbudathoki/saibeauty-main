import { getFeaturedServices } from "@/actions/home-actions";
import { FeaturedServices } from "./featured-services";

export async function FeaturedServicesServer() {
  const services = await getFeaturedServices({data: { limit: 6 }});
  return <FeaturedServices services={services} />
}