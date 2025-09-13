import { ChatChannelSidebar } from "@/components/chat-channel-sidebar";
import { SharedChannelHeader } from "@/components/shared-channel-header";


export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-background">
            <ChatChannelSidebar />
            <div className="flex flex-1 flex-col">
                <SharedChannelHeader />
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}

