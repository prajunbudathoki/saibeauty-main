import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { BookingCard } from "@/components/booking/booking-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Search,
  Calendar,
  MailQuestion,
  CalendarCheck,
  CalendarClock,
} from "lucide-react";
import { motion } from "motion/react";

export const Route = createFileRoute("/_client/profile/my-bookings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_client/profile/my-bookings/"!</div>;
}
