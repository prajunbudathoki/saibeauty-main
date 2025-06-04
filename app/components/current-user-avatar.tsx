"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@radix-ui/react-dropdown-menu";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import { authClient, useSession } from "../lib/auth-client";

export const CurrentUserAvatar = () => {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const name = session?.user.name || session?.user.email || "";
  const initials = name
    ?.split(" ")
    ?.map((word) => word[0])
    ?.join("")
    ?.toUpperCase();

  async function handleSignout() {
    await authClient.signOut();
    navigate({
      to: "/auth/login",
    });
  }

  // if (loading) {
  // }
  if (isPending) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (!session) {
    return (
      <Button asChild>
        <Link to="/auth/login">Login</Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          {session.user?.image && <AvatarImage src={session.user.image} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <DropdownMenuLabel>{name}</DropdownMenuLabel>
        </DropdownMenuItem>
        <Separator className="my-1" />
        <DropdownMenuItem>
          <Link to="/profile/my-bookings">Bookings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
