"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import type { Location } from "@/lib/type";
import { Card, CardContent } from "@/components/ui/card";
import { formatTime } from "@/lib/utils";
import { motion } from "motion/react";

export function LocationContactCard({ location }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold mb-1">{location.name}</h3>
            <p className="text-sm text-muted-foreground">{location.city}</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm mb-1">Address</p>
                <p className="text-muted-foreground text-sm">
                  {location.address}
                </p>
                <p className="text-muted-foreground text-sm">{location.city}</p>
              </div>
            </div>

            {location.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm mb-1">Phone</p>
                  <a
                    href={`tel:${location.phone}`}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors"
                  >
                    {location.phone}
                  </a>
                </div>
              </div>
            )}

            {location.email && (
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm mb-1">Email</p>
                  <a
                    href={`mailto:${location.email}`}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors"
                  >
                    {location.email}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm mb-1">Hours</p>
                <p className="text-muted-foreground text-sm">
                  {formatTime(location.opening_time)} -{" "}
                  {formatTime(location.closing_time)}
                </p>
                <p className="text-muted-foreground text-sm">
                  {location.is_open_on_weekends
                    ? "Open weekends"
                    : "Closed weekends"}
                </p>
              </div>
            </div>
          </div>

          {location.google_maps_url && (
            <div className="p-6 pt-0">
              <a
                href={location.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center py-2 px-4 bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors text-sm font-medium"
              >
                View on Map
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
