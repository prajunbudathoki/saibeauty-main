"use client"

import {
  assignStaffToAppointment,
  deleteAppointment,
  updateAppointmentStatus,
} from "@/actions/admin-appointment-actions"
import { getAvailableStaffByLocation } from "@/actions/staff-actions"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { Calendar, Clock, DollarSign, Mail, MapPin, MessageSquare, Phone, Scissors, Star, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { StarRating } from "../shared/star-rating"
import { AppointmentStatusBadge } from "./appointment-status-badge"

interface AppointmentDetailProps {
  appointment: any
  services: any[]
}

export function AppointmentDetail({ appointment, services }: AppointmentDetailProps) {
  const router = useRouter()
  const [status, setStatus] = useState(appointment.status)
  const [staffId, setStaffId] = useState(appointment.staff_id || "")
  const [availableStaff, setAvailableStaff] = useState<any[]>([])
  const [loadingStaff, setLoadingStaff] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setLoadingStatus(true)
    try {
      await updateAppointmentStatus(appointment.id, newStatus)
      setStatus(newStatus)
      toast.success("Appointment status updated")
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update appointment status")
    } finally {
      setLoadingStatus(false)
    }
  }

  const handleStaffSelect = async () => {
    if (!staffId) return

    try {
      await assignStaffToAppointment(appointment.id, staffId)
      toast.success("Staff assigned successfully")
    } catch (error) {
      console.error("Error assigning staff:", error)
      toast.error("Failed to assign staff")
    }
  }

  const handleLoadStaff = async () => {
    if (loadingStaff || availableStaff.length > 0) return

    setLoadingStaff(true)
    try {
      const staff = await getAvailableStaffByLocation(appointment.location_id)
      setAvailableStaff(staff)
    } catch (error) {
      console.error("Error loading staff:", error)
    } finally {
      setLoadingStaff(false)
    }
  }

  const handleDeleteAppointment = async () => {
    setLoadingDelete(true)
    try {
      await deleteAppointment(appointment.id)
      toast.success("Appointment deleted successfully")
      router.push("/admin/appointments")
    } catch (error) {
      console.error("Error deleting appointment:", error)
      toast.error("Failed to delete appointment")
      setLoadingDelete(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="font-medium">Date</div>
                  <div>{format(parseISO(appointment.start_time), "EEEE, MMMM d, yyyy")}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="font-medium">Time</div>
                  <div>
                    {format(parseISO(appointment.start_time), "h:mm a")} -
                    {format(parseISO(appointment.end_time), "h:mm a")}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="font-medium">Location</div>
                  <div>{appointment.location?.name}</div>
                  <div className="text-sm text-muted-foreground">{appointment.location?.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="font-medium">Staff</div>
                  <div>{appointment.staff?.name || "Not assigned"}</div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="font-medium mb-2">Status</div>
              <div className="flex items-center gap-4">
                <AppointmentStatusBadge status={status} />
                <Select value={status} onValueChange={handleStatusChange} disabled={loadingStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No-show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="flex justify-between items-center">
                  <div className="flex items-start gap-2">
                    <Scissors className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium">{service.location_service?.service?.name}</div>
                      {service.location_service?.service?.duration && (
                        <div className="text-sm text-muted-foreground">
                          {service.location_service?.service?.duration} minutes
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="font-medium">{formatPrice(service.price)}</div>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between items-center font-medium">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span>Total</span>
                </div>
                <span>{formatPrice(appointment.total_price)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Review Card if the appointment has a review */}
        {appointment.rating && (
          <Card>
            <CardHeader>
              <CardTitle>Customer Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <div className="font-medium">Rating</div>
                <StarRating rating={appointment.rating} />
              </div>

              {appointment.review && (
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Review</div>
                    <div className="mt-1 bg-muted/30 p-3 rounded-md">{appointment.review}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <User className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium">Name</div>
                <div>{appointment.customer_name}</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium">Email</div>
                <div>{appointment.customer_email}</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium">Phone</div>
                <div>{appointment.customer_phone}</div>
              </div>
            </div>

            {appointment.notes && (
              <div>
                <div className="font-medium mb-1">Notes</div>
                <div className="text-sm bg-muted p-3 rounded-md">{appointment.notes}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assign Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={staffId} onValueChange={setStaffId} onOpenChange={handleLoadStaff}>
              <SelectTrigger>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {loadingStaff ? (
                  <SelectItem value="loading" disabled>
                    Loading staff...
                  </SelectItem>
                ) : (
                  availableStaff.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Button
              onClick={handleStaffSelect}
              className="w-full mt-2"
              disabled={!staffId || staffId === appointment.staff_id}
            >
              Assign Staff
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <ConfirmDialog
              title="Delete Appointment"
              description="Are you sure you want to delete this appointment? This action cannot be undone."
              onConfirm={handleDeleteAppointment}
              trigger={
                <Button variant="destructive" className="w-full" disabled={loadingDelete}>
                  {loadingDelete ? "Deleting..." : "Delete Appointment"}
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

