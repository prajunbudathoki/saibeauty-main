import { UserSidebar } from "@/components/shared/user-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient, useSession } from "@/lib/auth-client";
import { createFileRoute } from "@tanstack/react-router";
import { EyeIcon, EyeOffIcon, MailIcon, PhoneIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_client/profile/user-info")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session } = useSession();

  //   if (!session) {
  //   return null;
  // }

  const isVerified = session?.user.emailVerified;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function updateUserInfo(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const { error } = await authClient.updateUser({
      name: fullName,
      phone,
    });

    if (error) {
      toast.error(error.code || "Failed to update profile");
      setIsLoading(false);
      return;
    }
    toast.success("Profile updated successfully");
    setNewPassword("");
    setConfirmPassword("");
    setIsLoading(false);
  }

  return (
    <div className="flex">
      <UserSidebar />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-muted-foreground">
              Welcome, {session?.user.name}
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

            <form onSubmit={updateUserInfo}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    defaultValue={session?.user.name}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Mobile Phone</Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      defaultValue={session?.user.phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <PhoneIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative flex items-center">
                    <Input
                      id="email"
                      type="email"
                      value={session?.user.email}
                      readOnly
                      className="pr-32"
                    />
                    <Badge
                      variant={isVerified ? "default" : "destructive"}
                      className={`
                        absolute right-10 top-1/2 -translate-y-1/2
                        flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
                        ${
                          isVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {isVerified ? (
                        <>
                          <svg
                            className="w-3 h-3 mr-1 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <title>as</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Verified
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3 h-3 mr-1 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <title>as</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Not Verified
                        </>
                      )}
                    </Badge>
                    <MailIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted-foreground"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
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
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted-foreground"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      tabIndex={-1}
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
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Spinner /> : "Update"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
