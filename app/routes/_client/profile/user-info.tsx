import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/auth-client";
import { UserSidebar } from "@/components/shared/user-sidebar";
import { createFileRoute } from "@tanstack/react-router";
import {
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  PhoneIcon,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_client/profile/user-info")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex">
      <UserSidebar />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-muted-foreground">
              Welcome, {data?.user.name ?? "User"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {new Date().toDateString()}
            </p>
          </div>
        </div>

        <Card className="w-full max-w-4xl">
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-medium">Account Information</h3>
            <p className="text-sm text-muted-foreground">
              Update your account information
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" defaultValue={data?.user.name} />
              </div>
              <div>
                <Label htmlFor="phone">Mobile Phone</Label>
                <div className="relative">
                  <Input id="phone" defaultValue={data?.user.phone} />
                  <PhoneIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="col-span-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    defaultValue={data?.user.email}
                  />
                  <MailIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div>
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button>Update</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
