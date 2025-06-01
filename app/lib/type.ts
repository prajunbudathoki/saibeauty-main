export interface Location {
  id: string
  name: string
  address: string
  city: string
  phone: string
  email: string | null
  description: string | null
  image: string | null
  opening_time: string
  closing_time: string
  is_open_on_weekends: boolean
  google_maps_url: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description: string | null
  image: string | null
  created_at: string
  index: number
}

export interface Service {
  id: string
  name: string
  description: string | null
  price: number
  duration: number | null
  image: string | null
  category_id: string
  created_at: string
  category?: Category
  index: number
}

export interface LocationService {
  id: string
  location_id: string
  service_id: string
  price: number | null
  created_at: string
  service?: Service
}

export interface Testimonial {
  id: string
  name: string
  designation: string | null
  rating: number
  review: string
  image: string | null
  created_at: string
}

export interface GalleryItem {
  id: string
  title: string
  description: string | null
  image: string
  created_at: string
}

export interface Contact {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  created_at: string
}

export interface Staff {
  id: string
  location_id: string
  name: string
  role: string
  bio: string | null
  image: string | null
  created_at: string
  is_available_for_booking: boolean
  index: number
  facebook_url: string | null
  instagram_url: string | null
  twitter_url: string | null
}

// New types for booking system
export interface Appointment {
  id: string
  customer_id: string | null
  location_id: string
  staff_id: string | null
  start_time: string
  end_time: string
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no-show"
  total_price: number
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  notes: string | null
  created_at: string
  updated_at: string
  rating: number | null
  location ?: Location
  review: string | null
  staff ?: Staff
}

export interface AppointmentService {
  id: string
  appointment_id: string
  location_service_id: string
  price: number
  duration: number | null
  notes: string | null
  created_at: string
  location_service?: LocationService
}

export interface TimeSlot {
  startTime: string
  endTime: string
  available: boolean
}

export interface CustomerDetails {
  name: string
  email: string
  phone: string
  notes: string
}

export interface BookingState {
  step: number
  location: Location | null
  date: string | null
  services: LocationService[]
  staff: Staff | null
  isNoPreferenceStaff: boolean
  timeSlot: TimeSlot | null
  customerDetails: CustomerDetails
  totalPrice: number
  totalDuration: number
}

