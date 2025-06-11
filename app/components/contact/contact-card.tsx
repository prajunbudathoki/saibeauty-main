import { useState } from "react";
import { motion } from "motion/react";
import { formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Trash2, ChevronDown, ChevronUp, Mail, Phone } from "lucide-react";
import { deleteContact } from "@/actions/contact-actions";
import { toast } from "sonner";

export function ContactCard({ contact }) {
  const [expanded, setExpanded] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteContact({ data: contact.id });
      toast.success("Contact deleted successfully");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete the contact");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{contact.name}</CardTitle>
            <span className="text-xs text-muted-foreground">
              {formatDate(contact.created_at)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${contact.email}`} className="hover:underline">
                {contact.email}
              </a>
            </div>

            {contact.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${contact.phone}`} className="hover:underline">
                  {contact.phone}
                </a>
              </div>
            )}

            <div className="mt-2">
              <div className={expanded ? "" : "line-clamp-2"}>
                {contact.message}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-xs"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show More
              </>
            )}
          </Button>

          <ConfirmDialog
            title="Delete Contact"
            description="Are you sure you want to delete this contact? This action cannot be undone."
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
        </CardFooter>
      </Card>
    </motion.div>
  );
}
