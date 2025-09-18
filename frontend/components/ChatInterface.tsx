"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MoreVertical, Smile, Paperclip, Send, MessageCircle, User, Settings } from "lucide-react"
import { Message } from "./chat/Message"
import * as signalR from "@microsoft/signalr";

import { MessageData, Contact } from "@/types/components";

const mockMessages: MessageData[] = [
  // {
  //   id: "1",
  //   content: "Hey there! How's your day going?",
  //   sender: "contact",
  //   timestamp: new Date(Date.now() - 300000),
  //   senderName: "Sarah",
  //   senderAvatar: "/professional-woman.png",
  // },
  // {
  //   id: "2",
  //   content: "Hi Sarah! It's been pretty good, just finished a big project. How about yours?",
  //   sender: "user",
  //   timestamp: new Date(Date.now() - 240000),
  //   senderName: "You",
  //   senderAvatar: "/professional-man.png",
  // },
]

const currentContact: Contact = {
  id: "1",
  name: "Sarah",
  avatar: "/professional-woman.png",
  isOnline: true,
}

export function ChatInterface() {
  const [messages, setMessages] = useState<MessageData[]>([]) // Start with empty messages
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    let connection: signalR.HubConnection | null = null;

    const startConnection = async () => {
      connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:7071/api")
        .withAutomaticReconnect()
        .build();

      connection.on("newMessage", (data: { id: string; message: { user: string; text: string }; createdAt: string }) => {
        console.log("Received message from SignalR:", data);
        setMessages((prev) => {
          // Prevent adding duplicate messages if received multiple times
          if (prev.some(msg => msg.id === data.id)) {
            return prev;
          }
          return [
            ...prev,
            {
              id: data.id,
              content: data.message.text,
              sender: data.message.user === "You" ? "user" : "contact",
              timestamp: new Date(data.createdAt),
              senderName: data.message.user,
              senderAvatar: data.message.user === "You" ? "/professional-man.png" : "/professional-woman.png",
            },
          ];
        });
        setIsTyping(false);
      });

      try {
        await connection.start();
        console.log("SignalR Connected.");
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
        connection = null; // Clear connection if failed
      }
    };

    startConnection();

    return () => {
      if (connection) {
        connection.stop();
        console.log("SignalR Disconnected.");
      }
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const messagePayload = {
      user: "You", // Assuming the current user is "You" for now
      text: newMessage.trim(),
    };

    setNewMessage("")

    try {
      // Send message to Azure Service Bus via our API function
      await fetch('http://localhost:7071/api/send-to-queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messagePayload)
      });
      console.log("Message sent to queue.");
    } catch (error) {
      console.error('Error sending message to queue:', error);
      // Optionally, show error message
    }
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
