"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Bell } from "lucide-react"

export function SharedChannelHeader() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200">
      <header className="flex items-center justify-between px-10 py-3">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-gray-800">
            <div className="w-8 h-8 text-blue-600">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Connect</h2>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Home
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Mentions
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              People
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              More
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Button variant="ghost" size="icon" className="rounded-full bg-gray-100 hover:bg-gray-200">
            <Bell className="w-5 h-5 text-gray-600" />
          </Button>
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder-user.jpg" alt="Current user" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>
    </div>
  )
}