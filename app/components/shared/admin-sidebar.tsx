"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Home,
  MapPin,
  Grid3X3,
  Scissors,
  Star,
  ImageIcon,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Menu,
  LogOut,
  Calendar,
  Settings,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Link } from "@tanstack/react-router";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export function AdminSidebar() {
  const [role, setRole] = useState<string>("moderator");

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await authClient.getSession();
      if (data?.session?.token) {
        setRole(data?.user?.role ?? "moderator");
      }
    };
    fetchSession();
  }, []);

  // Close mobile sidebar when path changes
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  // Close mobile sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const adminLinks: SidebarItem[] =
    role == "admin"
      ? [
          {
            title: "Employees",
            href: "/admin/employees",
            icon: <User className="h-5 w-5" />,
          },
        ]
      : [];

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Locations",
      href: "/admin/locations",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      title: "Categories",
      href: "/admin/categories",
      icon: <Grid3X3 className="h-5 w-5" />,
    },
    {
      title: "Services",
      href: "/admin/services",
      icon: <Scissors className="h-5 w-5" />,
    },
    {
      title: "Testimonials",
      href: "/admin/testimonials",
      icon: <Star className="h-5 w-5" />,
    },
    {
      title: "Gallery",
      href: "/admin/gallery",
      icon: <ImageIcon className="h-5 w-5" />,
    },
    {
      title: "Contacts",
      href: "/admin/contacts",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    // Add this new item
    {
      title: "Appointments",
      href: "/admin/appointments",
      icon: <Calendar className="h-5 w-5" />,
    },

    ...adminLinks,
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const sidebarVariants = {
    expanded: { width: "var(--sidebar-width)" },
    collapsed: { width: "var(--sidebar-width-collapsed)" },
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm shadow-sm"
        onClick={toggleMobileSidebar}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={collapsed ? "collapsed" : "expanded"}
        animate={mobileOpen ? "expanded" : collapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-card border-r shadow-md",
          "flex flex-col",
          "lg:sticky lg:z-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "transition-transform duration-300 ease-in-out lg:transition-none"
        )}
      >
        {/* Sidebar Header */}
        <div
          className={cn(
            "flex items-center h-16 px-4 border-b",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">SB</span>
              </div>
              <span className="font-bold text-xl">Sai Beauty</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden lg:flex hover:bg-muted"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Sidebar Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {sidebarItems.map((item) => {
              // const isActive =
              //   pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link to={item.href}>
                    <span
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all",
                        "hover:bg-accent hover:text-accent-foreground",
                        // isActive
                        //   ? "bg-primary text-primary-foreground font-medium shadow-sm"
                        //   : "text-foreground hover:translate-x-1",
                        collapsed && "justify-center px-0"
                      )}
                    >
                      {item.icon}
                      {!collapsed && <span>{item.title}</span>}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t mt-auto">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-2 text-sm text-muted-foreground",
              "hover:text-foreground transition-colors p-2 rounded-md hover:bg-accent",
              collapsed && "justify-center"
            )}
          >
            {!collapsed && <span>View Website</span>}
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
