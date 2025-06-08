import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AppointmentStatusBadgeProps {
  status: string
  className?: string
}

export function AppointmentStatusBadge({ status, className }: AppointmentStatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "confirmed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "cancelled":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      case "no-show":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <Badge className={cn(getStatusStyles(), "capitalize", className)} variant="outline">
      {status}
    </Badge>
  )
}