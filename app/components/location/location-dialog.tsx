import type React from "react";
import { useState } from "react";
import type { Location } from "@/lib/type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LocationForm } from "./location-form";

export function LocationDialog({ location, trigger, title }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <LocationForm location={location} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
