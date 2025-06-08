import type React from "react"

import { useState } from "react"
import type { Category, LocationService } from "@/lib/type"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LocationServiceForm } from "./location-service-form"


interface LocationServiceDialogProps {
  locationId: string
  locationService?: LocationService
  trigger: React.ReactNode
  title: string
  categories?: Category[]
}

export function LocationServiceDialog({ locationId,categories, locationService, trigger, title }: LocationServiceDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <LocationServiceForm
        categories={categories}
          locationId={locationId}
          locationService={locationService}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

