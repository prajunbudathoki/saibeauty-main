import { deleteCategory } from "@/actions/category-actions";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getCdnUrl } from "@/lib/utils";
import { Link, useRouter } from "@tanstack/react-router";
import { Edit, Eye, Scissors, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { CategoryDialog } from "./category-dialog";

export function CategoryCard({ category, serviceCount }) {
  const router = useRouter();
  const handleDelete = async () => {
    try {
      await deleteCategory({ data: category.id });
      toast.success("Category deleted successfully", {
        description: "The category has been deleted successfully.",
      });
      router.invalidate();
    } catch (error) {
      toast.error("Error deleting category", {
        description: "Failed to delete the category.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col border border-border/50 hover:border-border hover:shadow-md transition-all duration-300">
        <div
          className="relative h-40 overflow-hidden group"
          style={{
            background: `url('${getCdnUrl(category.image)}')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
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
              <Link to="/admin/categories/$id" params={{ id: category.id }}>
                <Eye className="h-4 w-4" />
              </Link>
              {/* <Link to={`/admin/categories/${category.id}`}>
                <Eye className="h-4 w-4" />
              </Link> */}
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
              description="Are you sure you want to delete this category? This will also delete all services in this category. This action cannot be undone."
              onConfirm={handleDelete}
              trigger={
                <Button
                  variant="ghost"
                  size={"icon"}
                  asChild
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                >
                  <div>
                    <Trash2 className="h-4 w-4" />
                  </div>
                </Button>
              }
            />
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
