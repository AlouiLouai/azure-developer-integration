
import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { memo } from "react"

interface ChannelMessageProps {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  timestamp: string
  isCurrentUser: boolean
}

export const ChannelMessage = memo(
  ({ id, userId, userName, userAvatar, content, timestamp, isCurrentUser }: ChannelMessageProps) => {
    return (
      <div key={id} className={`flex items-start gap-4 ${isCurrentUser ? "justify-end" : ""}`}>
        {!isCurrentUser && (
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
            <AvatarFallback>{userName[0]}</AvatarFallback>
          </Avatar>
        )}

        <div className={`flex flex-col gap-1 ${isCurrentUser ? "items-end" : "items-start"}`}>
          <p className={`text-sm font-medium text-gray-600 ${isCurrentUser ? "text-right" : ""}`}>
            {userName}
            <span className="text-xs text-gray-400 ml-2">{timestamp}</span>
          </p>
          <div
            className={`max-w-md rounded-lg p-3 shadow-sm ${
              isCurrentUser ? "bg-blue-600 text-white" : "bg-white text-gray-800"
            }`}>
            {content}
          </div>
        </div>

        {isCurrentUser && (
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
            <AvatarFallback>{userName[0]}</AvatarFallback>
          </Avatar>
        )}
      </div>
    )
  }
)
