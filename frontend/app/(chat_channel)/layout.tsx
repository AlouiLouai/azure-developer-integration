import { ChatChannelSidebar } from "@/components/chat-channel-sidebar"
import { SharedChannelHeader } from "@/components/shared-channel-header"

export default function ChatChannelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <ChatChannelSidebar />
      <div className="flex flex-col flex-1">
        <SharedChannelHeader />
        <main className="flex-1 overflow-auto pt-20">
          {children}
        </main>
      </div>
    </div>
  )
}
