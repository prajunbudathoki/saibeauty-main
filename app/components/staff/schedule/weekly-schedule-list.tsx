"use client"

import { useState } from "react"
import { toast } from "sonner"
import { type StaffSchedule, deleteStaffSchedule, updateStaffSchedule } from "@/actions/staff-schedule-actions"
import { getDayName } from "@/lib/date-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Clock, Trash2, Save, Edit, X } from "lucide-react"

interface WeeklyScheduleListProps {
  schedules: StaffSchedule[]
  staffId: string
  locationId: string
}

export function WeeklyScheduleList({ schedules, staffId, locationId }: WeeklyScheduleListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [loading, setLoading] = useState(false)

  // Sort schedules by day of week
  const sortedSchedules = [...schedules].sort((a, b) => a.day_of_week - b.day_of_week)

  const handleEdit = (schedule: StaffSchedule) => {
    setEditingId(schedule.id)
    setStartTime(schedule.start_time)
    setEndTime(schedule.end_time)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const handleSave = async (scheduleId: string) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("staff_id", staffId)
      formData.append("location_id", locationId)
      formData.append("start_time", startTime)
      formData.append("end_time", endTime)

      await updateStaffSchedule(scheduleId, formData)
      toast.success("Schedule updated successfully")
      setEditingId(null)
    } catch (error) {
      console.error("Error updating schedule:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update schedule")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (scheduleId: string) => {
    try {
      await deleteStaffSchedule(scheduleId, staffId, locationId)
      toast.success("Schedule deleted successfully")
    } catch (error) {
      console.error("Error deleting schedule:", error)
      toast.error("Failed to delete schedule")
    }
  }

  if (schedules.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            No schedules have been set up yet. Add your first schedule above.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{getDayName(schedule.day_of_week)}</h3>
                  {editingId === schedule.id ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-32 h-8"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-32 h-8"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {schedule.start_time} to {schedule.end_time}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {editingId === schedule.id ? (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleCancelEdit}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleSave(schedule.id)}
                      disabled={loading}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEdit(schedule)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}

                <ConfirmDialog
                  title="Delete Schedule"
                  description={`Are you sure you want to delete the schedule for ${getDayName(schedule.day_of_week)}?`}
                  onConfirm={() => handleDelete(schedule.id)}
                  trigger={
                    <Button variant="outline" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

