
import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { memo } from "react"

import { MessageProps } from "@/types/chat";

const getInitials = (name: string) => {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const Message = memo(({ id, content, sender, timestamp, senderName, senderAvatar }: MessageProps) => {
  return (
    <div
      key={id}
      className={`flex items-end gap-3 ${
        sender === "user" ? "justify-end ml-auto max-w-xl" : "max-w-xl"
      }`}>
      {sender === "contact" && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={senderAvatar || "/placeholder.svg"} />
          <AvatarFallback>{getInitials(senderName)}</AvatarFallback>
        </Avatar>
      )}

      <div className={`flex flex-col gap-1 ${sender === "user" ? "items-end" : "items-start"}`}>
        <p className="text-sm font-medium text-gray-800">{senderName}</p>
        <div
          className={`px-4 py-3 rounded-xl text-base leading-normal ${
            sender === "user"
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-100 text-gray-900 rounded-bl-none"
          }`}>
          {content}
        </div>
      </div>

      {sender === "user" && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={senderAvatar || "/placeholder.svg"} />
          <AvatarFallback>{getInitials(senderName)}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
})
