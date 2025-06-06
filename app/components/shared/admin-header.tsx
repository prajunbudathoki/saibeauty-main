"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useLocation, useRouterState } from "@tanstack/react-router";
import { boolean } from "better-auth";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function AdminHeader({ title }: { title: string }) {
  // const router = useRouterState();
  const location = useLocation();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    // const paths = router.location.pathname;
    const paths = location.pathname.split("/").filter(Boolean);

    // Start with Admin
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Admin", href: "/admin" }];

    // Build up the breadcrumbs
    let currentPath = "";

    for (let i = 1; i < paths.length; i++) {
      currentPath += `/${paths[i]}`;

      // Skip adding breadcrumb for dynamic segments like [id]
      if (paths[i].startsWith("[") && paths[i].endsWith("]")) {
        continue;
      }

      // Capitalize and format the label
      const label = paths[i].charAt(0).toUpperCase() + paths[i].slice(1);

      breadcrumbs.push({
        label,
        href: `/admin${currentPath}`,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="border-b bg-card sticky top-0 z-10 shadow-sm">
      <div className="container py-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-1"
        >
          <div className="flex items-center text-sm text-muted-foreground">
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && (
                  <span className="mx-2 text-muted-foreground/50">/</span>
                )}
                <span
                  className={cn(
                    "hover:text-primary transition-colors",
                    index === breadcrumbs.length - 1 &&
                      "font-medium text-foreground"
                  )}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </motion.div>
      </div>
    </div>
  );
}
