"use client";

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

interface ServiceDialogProps {
  service?: Service;
  trigger: React.ReactNode;
  title: string;
  categoryId?: string;
}

export function ServiceDialog({
  service,
  trigger,
  title,
  categoryId,
}: ServiceDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
