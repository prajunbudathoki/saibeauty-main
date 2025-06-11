import type React from "react";
import { useState } from "react";
import type { Service } from "@/lib/type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ServiceForm } from "./service-form";

export function ServiceDialog({ service, trigger, title, categoryId }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ServiceForm
          service={service}
          onSuccess={() => setOpen(false)}
          categoryId={categoryId}
        />
      </DialogContent>
    </Dialog>
  );
}
