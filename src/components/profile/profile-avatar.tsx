"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  avatar: string;
  username: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
}

export default function UserAvatar({
  avatar,
  username,
  size = "md",
  className,
  onClick,
}: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
    xl: "h-32 w-32 border-4 border-background",
  };

  return (
    <Avatar
      className={cn(
        sizeClasses[size],
        onClick && "cursor-pointer hover:opacity-90 transition-opacity",
        className,
      )}
      onClick={onClick}
    >
      <AvatarImage
        src={avatar || "/placeholder.svg"}
        alt={`${username}'s avatar`}
        className="object-cover"
      />
      <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold">
        {username?.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
