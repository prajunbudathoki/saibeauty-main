import { motion } from "motion/react";
import { formatPrice } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ServiceDialog } from "./service-dialog";
import { Trash2, Edit, Clock, Tag } from "lucide-react";
import { deleteService } from "@/actions/service-actions";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";

export function ServiceCard({ service }) {
  const router = useRouter();
  const handleDelete = async () => {
    try {
      await deleteService({ data: { id: service.id } });
      toast.success("Service deleted successfully");
      router.invalidate();
    } catch (error) {
      toast.error("Failed to delete the service");
    }
  };

  const imageUrl = null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative h-40">
          <img src={imageUrl} alt={service.name} className="object-cover" />
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg">{service.name}</h3>
            <span className="font-medium text-primary-foreground bg-primary px-2 py-1 rounded-md text-sm">
              {formatPrice(service.price)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pb-2 flex-1">
          {service.description && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
              {service.description}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span>{service.category?.name}</span>
            </div>

            {service.duration && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{service.duration} minutes</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-2 border-t">
          <div className="flex gap-2">
            <ServiceDialog
              service={service}
              title="Edit Service"
              categoryId={service.categoryId}
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />
            <ConfirmDialog
              title="Delete Service"
              description="Are you sure you want to delete this service? This action cannot be undone."
              onConfirm={handleDelete}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
