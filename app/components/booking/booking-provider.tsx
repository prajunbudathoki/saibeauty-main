"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import { useSession } from "@/lib/auth-client";
import type {
  BookingState,
  CustomerDetails,
  Location,
  LocationService,
  Staff,
  TimeSlot,
} from "@/lib/type";

const initialState: BookingState = {
  step: 1,
  location: null,
  date: null,
  services: [],
  staff: null,
  isNoPreferenceStaff: false,
  timeSlot: null,
  customerDetails: {
    name: "",
    email: "",
    phone: "",
    notes: "",
  },
  totalPrice: 0,
  totalDuration: 0,
};

type BookingAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_LOCATION"; payload: Location }
  | { type: "SET_DATE"; payload: string }
  | { type: "ADD_SERVICE"; payload: LocationService }
  | { type: "REMOVE_SERVICE"; payload: string }
  | { type: "SET_STAFF"; payload: Staff | null }
  | { type: "SET_NO_PREFERENCE_STAFF"; payload: boolean }
  | { type: "SET_TIME_SLOT"; payload: TimeSlot }
  | { type: "SET_CUSTOMER_DETAILS"; payload: CustomerDetails }
  | { type: "UPDATE_TOTALS" }
  | { type: "RESET" };

function bookingReducer(
  state: BookingState,
  action: BookingAction
): BookingState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };

    case "SET_LOCATION":
      return { ...state, location: action.payload };

    case "SET_DATE":
      return { ...state, date: action.payload };

    case "ADD_SERVICE": {
      const services = [...state.services];
      const exists = services.find((s) => s.id === action.payload.id);
      if (exists) return state;

      const newServices = [...services, action.payload];
      const totalPrice = newServices.reduce(
        (sum, s) => sum + (s.price || s.service?.price || 0),
        0
      );
      const totalDuration = newServices.reduce(
        (sum, s) => sum + (s.service?.duration || 0),
        0
      );
      return { ...state, services: newServices, totalPrice, totalDuration };
    }

    case "REMOVE_SERVICE": {
      const services = state.services.filter((s) => s.id !== action.payload);
      const totalPrice = services.reduce(
        (sum, s) => sum + (s.price || s.service?.price || 0),
        0
      );
      const totalDuration = services.reduce(
        (sum, s) => sum + (s.service?.duration || 0),
        0
      );
      return { ...state, services, totalPrice, totalDuration };
    }

    case "SET_STAFF":
      return {
        ...state,
        staff: action.payload,
        isNoPreferenceStaff: action.payload === null,
      };

    case "SET_NO_PREFERENCE_STAFF":
      return {
        ...state,
        isNoPreferenceStaff: action.payload,
        staff: action.payload ? null : state.staff,
      };

    case "SET_TIME_SLOT":
      return { ...state, timeSlot: action.payload };

    case "SET_CUSTOMER_DETAILS":
      return { ...state, customerDetails: action.payload };

    case "UPDATE_TOTALS": {
      const totalPrice = state.services.reduce(
        (sum, s) => sum + (s.price || s.service?.price || 0),
        0
      );
      const totalDuration = state.services.reduce(
        (sum, s) => sum + (s.service?.duration || 0),
        0
      );
      return { ...state, totalPrice, totalDuration };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

interface BookingContextType {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  addService: (service: LocationService) => void;
  removeService: (serviceId: string) => void;
  setStaff: (staff: Staff | null) => void;
  setNoPreferenceStaff: (noPreference: boolean) => void;
  setTimeSlot: (timeSlot: TimeSlot) => void;
  setCustomerDetails: (details: CustomerDetails) => void;
  reset: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  const { data: session } = useSession();

  const nextStep = () =>
    dispatch({ type: "SET_STEP", payload: state.step + 1 });
  const prevStep = () =>
    state.step > 1 && dispatch({ type: "SET_STEP", payload: state.step - 1 });
  const goToStep = (step: number) =>
    dispatch({ type: "SET_STEP", payload: step });
  const addService = (service: LocationService) =>
    dispatch({ type: "ADD_SERVICE", payload: service });
  const removeService = (id: string) =>
    dispatch({ type: "REMOVE_SERVICE", payload: id });
  const setStaff = (staff: Staff | null) =>
    dispatch({ type: "SET_STAFF", payload: staff });
  const setNoPreferenceStaff = (pref: boolean) =>
    dispatch({ type: "SET_NO_PREFERENCE_STAFF", payload: pref });
  const setTimeSlot = (timeSlot: TimeSlot) =>
    dispatch({ type: "SET_TIME_SLOT", payload: timeSlot });
  const setCustomerDetails = (details: CustomerDetails) =>
    dispatch({ type: "SET_CUSTOMER_DETAILS", payload: details });
  const reset = () => dispatch({ type: "RESET" });

  // Auto-fill customer info from session
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
    if (session?.user) {
      setCustomerDetails({
        email: session.user.email || "",
        name: session.user.name || "",
        phone: (session.user as any)?.phone || "", // If you've added `phone` via custom JWT or user model
        notes: "",
      });
    }
  }, [session]);

  return (
    <BookingContext.Provider
      value={{
        state,
        dispatch,
        nextStep,
        prevStep,
        goToStep,
        addService,
        removeService,
        setStaff,
        setNoPreferenceStaff,
        setTimeSlot,
        setCustomerDetails,
        reset,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
