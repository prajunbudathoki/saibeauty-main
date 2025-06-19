import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mb-6">
        <span className="text-5xl text-red-600  font-bold">404</span>
      </div>
      <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-6">
        Sorry, the page you are looking for does not exist or you do not have
        access.
      </p>
      <Link
        to="/"
        className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
