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

export const CurrentUserAvatar = () => {

  const [loading, setLoading] = useState(true);




  const navigate = useNavigate();


  const logout = async () => {
    navigate({
        to: "/auth/login"
    });
  };

  if (loading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

//   if (!session) {
    return (
      <Button asChild>
        <Link to="/auth/login">Login</Link>
      </Button>
    );
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger>
//         <Avatar>
//           {session.user_metadata.avatar_url && (
//             <AvatarImage
//               src={session.user_metadata.avatar_url}
//               alt={initials}
//             />
//           )}
//           <AvatarFallback>{initials}</AvatarFallback>
//         </Avatar>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent>
//         <DropdownMenuItem>
//           <DropdownMenuLabel>{name}</DropdownMenuLabel>
//         </DropdownMenuItem>
//         <Separator className="my-1" />
//         <DropdownMenuItem>
//           <Link href="/profile/my-bookings">Bookings</Link>
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
};
