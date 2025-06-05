"use client";

import type React from "react";

import { motion } from "motion/react";
import {
  MapPin,
  Grid3X3,
  Scissors,
  Star,
  ImageIcon,
  MessageSquare,
  Calendar,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description?: string;
  delay?: number;
}

function StatsCard({
  title,
  value,
  icon,
  description,
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <Card className="overflow-hidden border border-border/50 hover:border-border hover:shadow-md transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Update the DashboardStatsProps interface to include appointmentStats
interface DashboardStatsProps {
  locationCount: number;
  categoryCount: number;
  serviceCount: number;
  testimonialCount: number;
  galleryCount: number;
  contactCount: number;
  appointmentStats?: {
    today: number;
    upcoming: number;
    pending: number;
    total: number;
  };
}

// Update the DashboardStats function to include the new stats
export function DashboardStats({
  locationCount,
  categoryCount,
  serviceCount,
  testimonialCount,
  galleryCount,
  contactCount,
  appointmentStats,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Locations"
        value={locationCount}
        icon={<MapPin className="h-5 w-5" />}
        delay={0}
      />
      <StatsCard
        title="Categories"
        value={categoryCount}
        icon={<Grid3X3 className="h-5 w-5" />}
        delay={1}
      />
      <StatsCard
        title="Services"
        value={serviceCount}
        icon={<Scissors className="h-5 w-5" />}
        delay={2}
      />
      <StatsCard
        title="Testimonials"
        value={testimonialCount}
        icon={<Star className="h-5 w-5" />}
        delay={3}
      />
      <StatsCard
        title="Gallery Items"
        value={galleryCount}
        icon={<ImageIcon className="h-5 w-5" />}
        delay={4}
      />
      <StatsCard
        title="Contact Requests"
        value={contactCount}
        icon={<MessageSquare className="h-5 w-5" />}
        delay={5}
      />

      {appointmentStats && (
        <>
          <StatsCard
            title="Today's Appointments"
            value={appointmentStats.today}
            icon={<Calendar className="h-5 w-5" />}
            description="Appointments scheduled for today"
            delay={6}
          />
          <StatsCard
            title="Upcoming Appointments"
            value={appointmentStats.upcoming}
            icon={<Calendar className="h-5 w-5" />}
            description="Appointments in the next 7 days"
            delay={7}
          />
          <StatsCard
            title="Pending Appointments"
            value={appointmentStats.pending}
            icon={<Clock className="h-5 w-5" />}
            description="Appointments awaiting confirmation"
            delay={8}
          />
        </>
      )}
    </div>
  );
}
