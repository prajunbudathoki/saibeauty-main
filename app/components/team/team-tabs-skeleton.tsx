import { Skeleton } from "../ui/skeleton";

export default function TeamTabsSkeleton({ locations }) {
  return (
    <div className="space-y-8">
      <div className="flex gap-2 border-b">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-80" />
        ))}
      </div>
    </div>
  );
}
