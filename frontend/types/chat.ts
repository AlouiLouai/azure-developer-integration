export interface ChannelMessageProps {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  timestamp: string
  isCurrentUser: boolean
}

export interface MessageProps {
  id: string
  content: string
  sender: "user" | "contact"
  timestamp: Date
  senderName: string
  senderAvatar: string
}
