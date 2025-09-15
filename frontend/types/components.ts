export interface Message {
  id: string;
  text: string;
  time: string;
  user: {
    name: string;
    avatar: string;
  };
}

export interface ChannelChatInterfaceProps {
  channelName: string;
}

export interface Channel {
  id: string;
  name: string;
  type: "channel" | "dm";
  messages: number;
  avatar?: string;
}

export interface ChatChannelSidebarProps {
  channels: Channel[];
  directMessages: Channel[];
}

export interface ChatInterfaceProps {
  contactName: string;
}

export interface ChannelMessageData {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  timestamp: string
  isCurrentUser: boolean
}

export interface ChannelMember {
  id: string
  name: string
  role: string
  avatar: string
  status: "online" | "away" | "busy" | "offline"
}

export interface MessageData {
  id: string
  content: string
  sender: "user" | "contact"
  timestamp: Date
  senderName: string
  senderAvatar: string
}

export interface Contact {
  id: string
  name: string
  avatar: string
  isOnline: boolean
}

export interface ProfileData {
  name: string
  bio: string
  avatar: string
}