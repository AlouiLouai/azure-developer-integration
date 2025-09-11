"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Settings } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"

interface ProfileData {
  name: string
  bio: string
  avatar: string
}


export function ProfileInterface() {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || "Alex Doe",
    bio: "",
    avatar: user?.picture || "/professional-man.png",
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("[v0] Profile updated:", profileData)
    setIsLoading(false)
  }

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAvatarChange = () => {
    // In a real app, this would open a file picker
    console.log("[v0] Avatar change requested")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#dadce0] px-6 py-4 bg-white">
        <div className="flex items-center gap-3 text-[#202124]">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg className="text-[#4285f4]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <Link href="/">
            <h1 className="text-[#5f6368] text-xl font-medium tracking-wide">Connect</h1>
          </Link>
        </div>
        <div className="flex flex-1 justify-end items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-[#5f6368] hover:bg-gray-100">
            <Settings className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt="User avatar" />
            <AvatarFallback>{user?.name ? user.name.substring(0, 2).toUpperCase() : "AD"}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl bg-white rounded-lg border border-[#dadce0]">
          <div className="p-6 sm:p-8 border-b border-[#dadce0]">
            <h2 className="text-[#202124] text-2xl font-normal leading-tight">Profile</h2>
            <p className="text-[#5f6368] mt-1 text-sm">Manage your public profile information.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt="Profile picture" />
                  <AvatarFallback className="text-2xl">AD</AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white border border-[#dadce0] hover:bg-gray-50"
                  onClick={handleAvatarChange}
                >
                  <Camera className="h-4 w-4 text-[#5f6368]" />
                </Button>
              </div>
              <div className="flex-1">
                <Label htmlFor="name" className="text-sm font-medium text-[#5f6368] mb-1">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full rounded-md border-[#dadce0] bg-transparent px-4 py-3 text-base text-[#202124] focus:ring-2 focus:ring-[#4285f4] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio" className="text-sm font-medium text-[#5f6368] mb-1">
                Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us a little about yourself"
                value={profileData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className="w-full min-h-28 rounded-md border-[#dadce0] bg-transparent px-4 py-3 text-base text-[#202124] focus:ring-2 focus:ring-[#4285f4] focus:border-transparent resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                className="min-w-[84px] h-9 px-4 text-[#5f6368] text-sm font-medium hover:bg-[#f1f3f4]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[84px] h-9 px-4 bg-[#4285f4] text-white text-sm font-medium shadow-sm hover:opacity-90 disabled:opacity-50"
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
