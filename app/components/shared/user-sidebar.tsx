import type React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { Home, Calendar, Settings, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { Link } from "@tanstack/react-router";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export function UserSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data } = useSession();
  const user = {
    name: data?.user.name,
    email: data?.user.email,
    image: data?.user.image,
    phone: data?.user.phone,
  };
  const pathname = window.location.pathname;

  const sidebarItems: SidebarItem[] = [
    {
      title: "Home",
      href: "/user",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "My Appointments",
      href: "/user/appointments",
      icon: <Calendar className="h-5 w-5" />,
    },
  ];

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

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
        <span className="sr-only">Open sidebar</span>
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </Button>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          style={{ top: "64px" }}
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
        style={{
          top: "64px",
          //   background: "red",
          height: "calc(100vh-64px)",
        }}
      >
        {/* Sidebar Header with User Info */}
        <div
          className={cn(
            "flex flex-col items-center h-32 px-4 border-b justify-center"
          )}
        >
          <img
            src={user.image ?? undefined}
            alt="U"
            className="w-14 flex items-center justify-center h-14 rounded-full mb-2 shadow"
          />
          {!collapsed && (
            <>
              <span className="font-semibold">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </>
          )}
        </div>

        {/* Sidebar Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {sidebarItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link to={item.href}>
                    <span
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all",
                        "hover:bg-accent hover:text-accent-foreground",
                        isActive
                          ? "bg-primary text-primary-foreground font-medium shadow-sm"
                          : "text-foreground hover:translate-x-1",
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
            {!collapsed && <span>Logout</span>}
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
