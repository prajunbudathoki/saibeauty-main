import { CurrentUserAvatar } from "@/components/current-user-avatar";
import { BookingCTA } from "@/components/shared/booking-cta";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_client")({
  component: RouteComponent,
});

function RouteComponent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex text-primary py-2 ">
        <div className="container mx-auto flex items-center justify-between text-sm">
          Opening Time: 10 am to 10 pm
          <p>
            <a href="tel:+971508471241" className="hover:text-gray-500">
              <span className="hidden md:inline">Call us: </span>
              <span className="md:hidden">📞</span>
              +971 50 916 7521
            </a>
          </p>
        </div>
      </header>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-200",
          scrolled ? "bg-primary shadow-sm" : "bg-primary backdrop-blur-sm"
        )}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-medium text-xl h-full flex items-center w-10 md:w-48 relative"
          >
            <img
              src="/saibeauty1.png"
              alt="Sai Beauty"
              className="h-13 hidden md:block object-cover absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0 md:left-0 md:top-0 md:h-full md:w-auto"
            />
            <img
              src="/saibeauty2.png"
              alt="Sai Beauty"
              className="h-13 md:hidden object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0 md:left-0 md:top-0 md:h-full md:w-auto"
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center justify-center flex-1 px-4">
            <div className="flex items-center space-x-6 justify-center">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/services", label: "Services" },
                { href: "/team", label: "Team" },
                { href: "/gallery", label: "Gallery" },
                { href: "/profile/my-bookings", label: "My Bookings" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-primary-foreground hover:text-secondary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Link
              to="/profile/booking"
              className="bg-primary text-white px-4 py-2 rounded hover:text-gray-500 transition-colors"
            >
              Book Now
            </Link>

            <CurrentUserAvatar />

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "lg:hidden absolute w-full bg-white border-b transition-all duration-200 overflow-hidden",
            mobileMenuOpen ? "max-h-[400px] shadow-md" : "max-h-0"
          )}
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About Us" },
              { href: "/services", label: "Services" },
              { href: "/team", label: "Team" },
              { href: "/gallery", label: "Gallery" },
              { href: "/profile/my-bookings", label: "My Bookings" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="py-2 text-gray-600 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 flex flex-col space-y-2">
              <Link
                to="/profile/booking"
                className="bg-primary text-white py-2 px-4 rounded text-center hover:bg-primary/90 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book an Appointment
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <BookingCTA />

      <footer className="bg-muted py-12 border-t">
        <div className="container grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold mb-4">Sai Beauty</h3>
            <p className="text-muted-foreground">
              Providing luxury beauty services at multiple locations. Our team
              of professionals is dedicated to making you look and feel your
              best.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/services"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Services
              </Link>
              <Link
                to="/team"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Our Team
              </Link>
              <Link
                to="/gallery"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Gallery
              </Link>
              <Link
                to="/profile/my-bookings"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                My Bookings
              </Link>
              <Link
                to="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-muted-foreground space-y-2">
              <p>Email: info@saibeauty.com</p>
              <p>Phone: +971 50 916 7521</p>
            </address>
            <div className="flex space-x-4 mt-4">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.facebook.com/saibeautydxb/"
                className="text-foreground hover:text-primary transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-facebook"
                >
                  <title>as</title>
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.instagram.com/saibeautysalon.ae"
                className="text-foreground hover:text-primary transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-instagram"
                >
                  <title>as</title>
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="container mt-8 pt-8 border-t border-muted-foreground/20 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Sai Beauty. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
