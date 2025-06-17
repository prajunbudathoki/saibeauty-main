import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StaffForm } from "./staff-form";
import type { Staff } from "@/generated/prisma";

interface StaffDialogProps {
  locationId: string;
  staff?: Staff;
  trigger: React.ReactNode;
  title: string;
}

export function StaffDialog({
  locationId,
  staff,
  trigger,
  title,
}: StaffDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <StaffForm
          locationId={locationId}
          staff={staff}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
