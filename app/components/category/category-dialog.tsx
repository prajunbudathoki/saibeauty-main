"use client"

import type React from "react"

import { useState } from "react"
import type { Category } from "@/lib/type"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CategoryForm } from "./category-form"

interface CategoryDialogProps {
  category?: Category
  trigger: React.ReactNode
  title: string
}

export function CategoryDialog({ category, trigger, title }: CategoryDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <CategoryForm category={category} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

