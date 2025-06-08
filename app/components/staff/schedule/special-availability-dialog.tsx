"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Trash2 } from "lucide-react"
import {
  type SpecialAvailability,
  deleteSpecialAvailability,
  getSpecialAvailabilityForDate,
  upsertSpecialAvailability,
} from "@/actions/staff-availability-actions"

interface SpecialAvailabilityDialogProps {
  open: boolean
  onOpenChange: (refreshData?: boolean) => void
  date: Date
  staffId: string
  locationId: string
  hasRegularSchedule?: boolean
}

export function SpecialAvailabilityDialog({
  open,
  onOpenChange,
  date,
  staffId,
  locationId,
  hasRegularSchedule = false,
}: SpecialAvailabilityDialogProps) {
  const [loading, setLoading] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")
  const [notes, setNotes] = useState("")
  const [existingRecord, setExistingRecord] = useState<SpecialAvailability | null>(null)

  const formattedDate = format(date, "yyyy-MM-dd")
  const displayDate = format(date, "EEEE, MMMM d, yyyy")

  useEffect(() => {
    const fetchExistingAvailability = async () => {
      try {
        const data = await getSpecialAvailabilityForDate(staffId, locationId, formattedDate)
        if (data) {
          setExistingRecord(data)
          setIsAvailable(data.is_available)
          if (data.start_time) setStartTime(data.start_time)
          if (data.end_time) setEndTime(data.end_time)
          setNotes(data.notes || "")
        } else {
          // Reset form for new entry
          setExistingRecord(null)
          setIsAvailable(hasRegularSchedule) // Default to the regular schedule status
          setStartTime("09:00")
          setEndTime("17:00")
          setNotes("")
        }
      } catch (error) {
        console.error("Error fetching availability:", error)
        toast.error("Failed to load availability data")
      }
    }

    if (open) {
      fetchExistingAvailability()
    }
  }, [open, staffId, locationId, formattedDate, hasRegularSchedule])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("staff_id", staffId)
      formData.append("location_id", locationId)
      formData.append("date", formattedDate)
      formData.append("is_available", isAvailable.toString())

      if (isAvailable) {
        formData.append("start_time", startTime)
        formData.append("end_time", endTime)
      } else {
        formData.append("start_time", "")
        formData.append("end_time", "")
      }

      formData.append("notes", notes)

      await upsertSpecialAvailability(formData)
      toast.success("Availability updated successfully")
      onOpenChange(true) // Close dialog and refresh data
    } catch (error) {
      console.error("Error saving availability:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save availability")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!existingRecord) return

    try {
      await deleteSpecialAvailability(existingRecord.id, staffId, locationId)
      toast.success("Special availability deleted")
      onOpenChange(true) // Close dialog and refresh data
    } catch (error) {
      console.error("Error deleting availability:", error)
      toast.error("Failed to delete availability")
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Special Availability for {displayDate}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is_available">Available on this day</Label>
              <div className="text-sm text-muted-foreground">
                {isAvailable ? "Staff is available to work" : "Staff is not available to work"}
              </div>
            </div>
            <Switch id="is_available" checked={isAvailable} onCheckedChange={setIsAvailable} />
          </div>

          {isAvailable && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this day's availability"
              rows={3}
            />
          </div>

          <div className="flex justify-between pt-4">
            <div>
              {existingRecord && (
                <ConfirmDialog
                  title="Delete Special Availability"
                  description="Are you sure you want to delete this special availability? This will revert to the regular schedule."
                  onConfirm={handleDelete}
                  trigger={
                    <Button type="button" variant="outline" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  }
                />
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

