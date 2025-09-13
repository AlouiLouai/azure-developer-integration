"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MoreVertical, Smile, Paperclip, Send, MessageCircle, User, Settings } from "lucide-react"
import { Message } from "./chat/Message"

interface MessageData {
  id: string
  content: string
  sender: "user" | "contact"
  timestamp: Date
  senderName: string
  senderAvatar: string
}

interface Contact {
  id: string
  name: string
  avatar: string
  isOnline: boolean
}

const mockMessages: MessageData[] = [
  {
    id: "1",
    content: "Hey there! How's your day going?",
    sender: "contact",
    timestamp: new Date(Date.now() - 300000),
    senderName: "Sarah",
    senderAvatar: "/professional-woman.png",
  },
  {
    id: "2",
    content: "Hi Sarah! It's been pretty good, just finished a big project. How about yours?",
    sender: "user",
    timestamp: new Date(Date.now() - 240000),
    senderName: "You",
    senderAvatar: "/professional-man.png",
  },
  {
    id: "3",
    content: "That's great to hear! Mine's been busy, but productive. I'm working on a new design for a client.",
    sender: "contact",
    timestamp: new Date(Date.now() - 180000),
    senderName: "Sarah",
    senderAvatar: "/professional-woman.png",
  },
  {
    id: "4",
    content: "Sounds interesting! What kind of design?",
    sender: "user",
    timestamp: new Date(Date.now() - 120000),
    senderName: "You",
    senderAvatar: "/professional-man.png",
  },
  {
    id: "5",
    content: "It's for a new e-commerce site, focusing on sustainable products. Lots of green and natural elements.",
    sender: "contact",
    timestamp: new Date(Date.now() - 60000),
    senderName: "Sarah",
    senderAvatar: "/professional-woman.png",
  },
  {
    id: "6",
    content: "Nice! That aligns well with current trends. I'm sure it'll look fantastic.",
    sender: "user",
    timestamp: new Date(),
    senderName: "You",
    senderAvatar: "/professional-man.png",
  },
]

const currentContact: Contact = {
  id: "1",
  name: "Sarah",
  avatar: "/professional-woman.png",
  isOnline: true,
}

export function ChatInterface() {
  const [messages, setMessages] = useState<MessageData[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: MessageData = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender: "user",
      timestamp: new Date(),
      senderName: "You",
      senderAvatar: "/professional-man.png",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate typing indicator and response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const response: MessageData = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for sharing! I'll get back to you on that.",
        sender: "contact",
        timestamp: new Date(),
        senderName: "Sarah",
        senderAvatar: "/professional-woman.png",
      }
      setMessages((prev) => [...prev, response])
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6">
            {messages.map((message) => (
              <Message key={message.id} {...message} />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-end gap-3 max-w-xl">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={currentContact.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{currentContact.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 items-start">
                  <p className="text-sm font-medium text-gray-800">{currentContact.name}</p>
                  <div className="px-4 py-3 rounded-xl rounded-bl-none bg-gray-100">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t border-gray-200 px-6 py-4 bg-white">
          <div className="flex items-center space-x-3">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 rounded-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
            />

            <Button variant="ghost" size="icon" className="p-2 rounded-full text-gray-500 hover:bg-gray-200">
              <Smile className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="p-2 rounded-full text-gray-500 hover:bg-gray-200">
              <Paperclip className="h-5 w-5" />
            </Button>

            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
