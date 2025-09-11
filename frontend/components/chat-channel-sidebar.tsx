"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageCircle, Users, User, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"

export function ChatChannelSidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/chat",
      icon: MessageCircle,
      label: "One-to-One Chat",
    },
    {
      href: "/channel",
      icon: Users,
      label: "Channel Chat",
    },
    {
      href: "/profile",
      icon: User,
      label: "Profile",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
    },
  ]

  return (
    <div className="w-20 flex flex-col items-center bg-gray-100 py-4 space-y-6">
      {/* Logo */}
      <div className="text-blue-600">
        <MessageCircle className="h-8 w-8" />
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col items-center space-y-4 text-gray-500">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "p-3 rounded-full",
              pathname === item.href
                ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                : "hover:bg-gray-200"
            )}
          >
            <item.icon className="h-5 w-5" />
          </Link>
        ))}
      </div>

      {/* User Avatar */}
      <div className="mt-auto">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/diverse-user-avatars.png" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
