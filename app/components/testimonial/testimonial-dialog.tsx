"use client"

import type React from "react"

import { useState } from "react"
import type { Testimonial } from "@/lib/type"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TestimonialForm } from "./testimonial-form"

interface TestimonialDialogProps {
  testimonial?: Testimonial
  trigger: React.ReactNode
  title: string
}

export function TestimonialDialog({ testimonial, trigger, title }: TestimonialDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <TestimonialForm testimonial={testimonial} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

