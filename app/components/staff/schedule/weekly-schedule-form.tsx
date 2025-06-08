"use client"

import type React from "react"

import { useState } from "react"
import { toast } from "sonner"
import { createStaffSchedule } from "@/actions/staff-schedule-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WeeklyScheduleFormProps {
  staffId: string
  locationId: string
  existingDays: number[]
}

export function WeeklyScheduleForm({ staffId, locationId, existingDays }: WeeklyScheduleFormProps) {
  const [loading, setLoading] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string>("")
  const [startTime, setStartTime] = useState("10:00")
  const [endTime, setEndTime] = useState("22:00")

  const days = [
    { value: "0", label: "Sunday" },
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
  ]

  // Filter out days that already have schedules
  const availableDays = days.filter((day) => !existingDays.includes(Number.parseInt(day.value)))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedDay) {
      toast.error("Please select a day")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("staff_id", staffId)
      formData.append("location_id", locationId)
      formData.append("day_of_week", selectedDay)
      formData.append("start_time", startTime)
      formData.append("end_time", endTime)

      await createStaffSchedule(formData)
      toast.success("Schedule created successfully")

      // Reset form
      setSelectedDay("")
      setStartTime("10:00")
      setEndTime("22:00")
    } catch (error) {
      console.error("Error creating schedule:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create schedule")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Weekly Schedule</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="day_of_week">Day of Week</Label>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger id="day_of_week">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {availableDays.length > 0 ? (
                  availableDays.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    All days have been scheduled
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

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
              <Input id="end_time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading || availableDays.length === 0}>
            {loading ? "Adding..." : "Add Schedule"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

