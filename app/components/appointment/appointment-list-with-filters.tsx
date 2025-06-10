import { useState, useEffect } from "react";
import { getAppointments } from "@/actions/admin-appointment-actions";
import { getAvailableStaffByLocation } from "@/actions/staff-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarIcon,
  Clock,
  Eye,
  MoreHorizontal,
  Search,
  X,
} from "lucide-react";
import { AppointmentStatusBadge } from "./appointment-status-badge";
import { format, parseISO, startOfDay, endOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Location, Staff } from "@/lib/type";
import { Link } from "@tanstack/react-router";

export function AppointmentListWithFilters({ locations }) {
  // Filter states
  const [locationId, setLocationId] = useState<string>("");
  const [staffId, setStaffId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [locationStaff, setLocationStaff] = useState<Staff[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  // Appointment list states
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial fetch of appointments
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch staff for selected location
  useEffect(() => {
    async function fetchStaffForLocation() {
      if (!locationId || locationId === "all") {
        setLocationStaff([]);
        setStaffId("");
        return;
      }

      setLoadingStaff(true);
      try {
        const staff = await getAvailableStaffByLocation({ data: locationId });
        const normalizedStaff = staff.map((s: any) => ({
          ...s,
          created_at:
            typeof s.created_at === "string"
              ? s.created_at
              : s.created_at.toISOString(),
        }));
        setLocationStaff(normalizedStaff);
        setStaffId("");
      } catch (error) {
        console.error("Error fetching staff for location:", error);
      } finally {
        setLoadingStaff(false);
      }
    }

    fetchStaffForLocation();
  }, [locationId]);

  // Function to fetch appointments based on current filter state
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
      // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
      let startDate, endDate;

      if (date) {
        startDate = startOfDay(date).toISOString();
        endDate = endOfDay(date).toISOString();
      }

      const filters = {
        startDate,
        endDate,
        locationId: locationId && locationId !== "all" ? locationId : undefined,
        staffId: staffId && staffId !== "all" ? staffId : undefined,
        status: status && status !== "all" ? status : undefined,
        search: search || undefined,
      };

      const data = await getAppointments({ data: filters });
      setAppointments(data ?? []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    fetchAppointments();
  };

  const clearFilters = () => {
    setLocationId("");
    setStaffId("");
    setStatus("");
    setDate(undefined);
    setSearch("");

    // Use setTimeout to ensure state updates are processed before fetching
    setTimeout(() => {
      fetchAppointments();
    }, 0);
  };

  // Check if any filters are active
  const hasActiveFilters = locationId || staffId || status || date || search;

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name, email or phone"
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setSearch("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Location and Staff Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select value={locationId} onValueChange={setLocationId}>
              <SelectTrigger id="location">
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff">Staff</Label>
            <Select
              value={staffId}
              onValueChange={setStaffId}
              disabled={!locationId || locationId === "all" || loadingStaff}
            >
              <SelectTrigger id="staff">
                <SelectValue
                  placeholder={loadingStaff ? "Loading staff..." : "All staff"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All staff</SelectItem>
                {locationStaff.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No-show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {date && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-1"
                onClick={() => setDate(undefined)}
              >
                <X className="h-3 w-3 mr-1" /> Clear date
              </Button>
            )}
          </div>
        </div>

        {/* Filter Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
          >
            Clear Filters
          </Button>
          <Button onClick={applyFilters}>Apply Filters</Button>
        </div>
      </div>

      {/* Appointments List Section */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <h3 className="text-lg font-medium mb-2">No appointments found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or create a new appointment.
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>
                          {format(
                            parseISO(appointment.start_time),
                            "MMM d, yyyy"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {format(parseISO(appointment.start_time), "h:mm a")} -
                          {format(parseISO(appointment.end_time), "h:mm a")}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {appointment.customer_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {appointment.customer_email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {appointment.location?.name || "Unknown location"}
                  </TableCell>
                  <TableCell>
                    {appointment.staff?.name || (
                      <span className="text-muted-foreground text-sm">
                        Not assigned
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <AppointmentStatusBadge
                      status={appointment.status}
                      className={""}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to="/admin/appointments/$id" params={{ id: appointment.id }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
