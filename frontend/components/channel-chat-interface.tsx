"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Bell, Smile, ImageIcon, Plus } from "lucide-react"
import { ChannelMessage } from "./chat/ChannelMessage"

interface ChannelMessageData {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  timestamp: string
  isCurrentUser: boolean
}

interface ChannelMember {
  id: string
  name: string
  role: string
  avatar: string
  status: "online" | "away" | "busy" | "offline"
}

const mockMessages: ChannelMessageData[] = [
  {
    id: "1",
    userId: "sarah",
    userName: "Sarah",
    userAvatar: "/professional-woman.png",
    content:
      "Hey team, just a quick reminder about our meeting tomorrow at 10 AM to discuss the project timeline. Please come prepared with any updates or roadblocks you've encountered.",
    timestamp: "10:00 AM",
    isCurrentUser: false,
  },
  {
    id: "2",
    userId: "david",
    userName: "David",
    userAvatar: "/professional-man.png",
    content: "Got it, Sarah. I'll be there with my updates.",
    timestamp: "10:01 AM",
    isCurrentUser: false,
  },
  {
    id: "3",
    userId: "emily",
    userName: "Emily",
    userAvatar: "/diverse-user-avatars.png",
    content: "Sounds good, I'll have my progress report ready.",
    timestamp: "10:02 AM",
    isCurrentUser: false,
  },
  {
    id: "4",
    userId: "current",
    userName: "You",
    userAvatar: "/professional-man.png",
    content: "Great, looking forward to it. Let's make sure we're all aligned on our goals for the next phase.",
    timestamp: "10:05 AM",
    isCurrentUser: true,
  },
]

const mockMembers: ChannelMember[] = [
  {
    id: "sarah",
    name: "Sarah",
    role: "Product Manager",
    avatar: "/professional-woman.png",
    status: "online",
  },
  {
    id: "david",
    name: "David",
    role: "Software Engineer",
    avatar: "/professional-man.png",
    status: "online",
  },
  {
    id: "emily",
    name: "Emily",
    role: "UX Designer",
    avatar: "/diverse-user-avatars.png",
    status: "away",
  },
  {
    id: "alex",
    name: "Alex",
    role: "QA Engineer",
    avatar: "/professional-man.png",
    status: "busy",
  },
]

export function ChannelChatInterface() {
  const [messages, setMessages] = useState<ChannelMessageData[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChannelMessageData = {
        id: Date.now().toString(),
        userId: "current",
        userName: "You",
        userAvatar: "/professional-man.png",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isCurrentUser: true,
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStatusColor = (status: ChannelMember["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex flex-1 pt-20 bg-gray-50">
        <div className="flex-1 p-8 grid grid-cols-12 gap-8">
          {/* Chat Area */}
          <div className="col-span-8 flex flex-col h-[calc(100vh-120px)]">
            {/* Channel Header */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Project Team</h1>
              <p className="text-sm text-gray-500">A dedicated space for our project collaboration.</p>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                {messages.map((message) => (
                  <ChannelMessage key={message.id} {...message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="mt-auto pt-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Message #project-team"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full rounded-full border-gray-300 bg-white py-3 pl-5 pr-32 focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100">
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100">
                    <ImageIcon className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Members Sidebar */}
          <aside className="col-span-4 bg-white rounded-lg p-6 shadow-sm h-[calc(100vh-120px)] flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Members</h2>

            <ScrollArea className="flex-1">
              <div className="space-y-4">
                {mockMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                          member.status
                        )}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{member.name}</p>
                      <p className="text-sm text-gray-500 truncate">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </Button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
