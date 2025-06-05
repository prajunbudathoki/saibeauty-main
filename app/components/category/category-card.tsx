import { motion } from "motion/react";
import type { Category } from "@/lib/type";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CategoryDialog } from "./category-dialog";
import { Trash2, Edit, Scissors, Eye } from "lucide-react";
import { deleteCategory } from "@/actions/category-actions";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

interface CategoryCardProps {
  category: Category;
  serviceCount: number;
}

export function CategoryCard({ category, serviceCount }: CategoryCardProps) {
  const handleDelete = async (id: string) => {
    try {
      await deleteCategory({ data: id });
      toast.success("Category deleted successfully", {
        description: "The category has been deleted successfully.",
      });
    } catch (error) {
      toast.error("Error deleting category", {
        description: "Failed to delete the category.",
      });
    }
  };

  const imageUrl = "https://picsum.photos/id/237/200/300";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col border border-border/50 hover:border-border hover:shadow-md transition-all duration-300">
        <div className="relative h-40 overflow-hidden group">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={category.name}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardHeader className="pb-2">
          <h3 className="font-bold text-lg">{category.name}</h3>
        </CardHeader>
        <CardContent className="pb-2 flex-1">
          {category.description && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {category.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary rounded-full px-3 py-1 w-fit">
            <Scissors className="h-4 w-4" />
            <span>
              {serviceCount} {serviceCount === 1 ? "service" : "services"}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-2 border-t">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
              asChild
            >
              <Link to={"/admin/categories/" + category.id}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>

            <CategoryDialog
              category={category}
              title="Edit Category"
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />

            <ConfirmDialog
              title="Delete Category"
              description={`Are you sure you want to delete this category? This will also delete all services in this category. This action cannot be undone.`}
              onConfirm={() => handleDelete(category.id)}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
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
