"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid';
import { useSignalRConnection } from '../hooks/use-signalr-connection';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Smile, Paperclip, Send, MessageCircle, Settings } from "lucide-react"
import { Message } from "./chat/Message"


import { MessageData, Contact } from "@/types/components";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import { User } from "@/types/auth"; // Import User interface

const mockMessages: MessageData[] = [
  // Initial messages will be loaded from history
]

export function ChatInterface() {
  const [messages, setMessages] = useState<MessageData[]>([]) // Start with empty messages
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { user, isAuthenticated } = useAuth(); // Use the useAuth hook
  const { connection, isConnected, error, registerHandler, removeHandler } = useSignalRConnection(user);
  console.log("ChatInterface rendered. Connection:", connection, "IsConnected:", isConnected, "User:", user);

  const currentUserDisplayName = user?.name || "You"; // Get user's name or default
  const currentUserAvatar = user?.picture || "/professional-man.png"; // Get user's picture or default

  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(null); // New state for selected recipient
  const [contacts, setContacts] = useState<User[]>([]); // New state for contacts, initialized empty

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    console.log("ChatInterface: fetchUsers useEffect running. User:", user);
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:7071/api/users');
        if (response.ok) {
          const allUsers: User[] = await response.json();
          // Filter out the current authenticated user from the contact list
          const filteredUsers = allUsers.filter(u => user && u.id !== user.id);
          setContacts(filteredUsers);
        } else {
          console.error("Failed to fetch users:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [user]); // Re-run if the current authenticated user changes

  useEffect(() => {
    console.log("ChatInterface: loadConversationHistory useEffect running. User:", user, "SelectedRecipient:", selectedRecipient);
    const loadConversationHistory = async () => {
      if (user && selectedRecipient) {
        const userIds = [user.id, selectedRecipient.id].sort();
        const conversationId = userIds.join('_');

        try {
          const response = await fetch(`http://localhost:7071/api/messages/history?conversationId=${conversationId}`);
          if (response.ok) {
            const history: any[] = await response.json(); // Adjust type as needed
            const formattedHistory = history.map(msg => ({
              id: msg.id,
              content: msg.text,
              sender: (msg.sender.name === currentUserDisplayName ? "user" : "contact") as "user" | "contact",
              timestamp: new Date(msg.createdAt),
              senderName: msg.sender.name,
              senderAvatar: msg.sender.picture || (msg.sender.name === currentUserDisplayName ? currentUserAvatar : "/professional-woman.png"),
            }));
            setMessages(formattedHistory);
          } else {
            console.error("Failed to load conversation history:", response.statusText);
            setMessages([]);
          }
        } catch (error) {
          console.error("Error loading conversation history:", error);
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    };

    loadConversationHistory();
  }, [selectedRecipient, user, currentUserDisplayName, currentUserAvatar]); // Dependencies

  // Effect for managing SignalR groups (joining/leaving conversations)
  useEffect(() => {
    console.log("ChatInterface: SignalR group management useEffect running. Connection:", connection, "IsConnected:", isConnected, "User:", user, "SelectedRecipient:", selectedRecipient);

    if (!connection || !isConnected || !user || !selectedRecipient) {
      console.log("ChatInterface: Skipping group management - connection, user, or recipient not ready.");
      return;
    }

    const userIds = [user.id, selectedRecipient.id].sort();
    const conversationId = userIds.join('_');

    const handleNewMessage = (data: { id: string; message: { sender: User; recipient: User; conversationId: string; text: string }; createdAt: string }) => {
      console.log("ChatInterface: handleNewMessage called. SignalR newMessage event received!");
      console.log("ChatInterface: Received message from SignalR:", data);
      setMessages((prev) => {
        if (prev.some(msg => msg.id === data.id)) {
          console.log("ChatInterface: Duplicate message received, ignoring.", data.id);
          return prev;
        }
        console.log("ChatInterface: Adding new message to state.", data.id);
        return [
          ...prev,
          {
            id: data.id,
            content: data.message.text,
            sender: data.message.sender.name === currentUserDisplayNameRef.current ? "user" : "contact",
            timestamp: new Date(data.createdAt),
            senderName: data.message.sender.name,
            senderAvatar: data.message.sender.picture || (data.message.sender.name === currentUserDisplayNameRef.current ? currentUserAvatar : "/professional-woman.png"),
          },
        ];
      });
      setIsTyping(false);
    };

    registerHandler("newMessage", handleNewMessage);

    const joinChatGroup = async () => {
      console.log(`ChatInterface: Attempting to join SignalR group: ${conversationId} for user: ${user.id}`);
      try {
        const joinGroupResponse = await fetch('http://localhost:7071/api/signalr/joinGroup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user.id,
            groupName: conversationId,
          })
        });

        if (joinGroupResponse.ok) {
          console.log(`ChatInterface: Successfully joined SignalR group: ${conversationId}`);
        } else {
          const errorText = await joinGroupResponse.text();
          console.error(`ChatInterface: Failed to join SignalR group: ${joinGroupResponse.status} ${joinGroupResponse.statusText} - ${errorText}`);
        }
      } catch (error) {
        console.error('ChatInterface: Error joining SignalR group:', error);
      }
    };

    // TODO: Implement leave group logic here if needed
    // For now, just join the new group
    joinChatGroup();

    return () => {
      console.log(`ChatInterface: Group management cleanup for conversation: ${conversationId}`);
      removeHandler("newMessage", handleNewMessage);
      // Cleanup: Potentially leave the group when selectedRecipient changes or component unmounts
      // This would require a leaveGroup API endpoint
    };
  }, [user, selectedRecipient, connection, isConnected, registerHandler, removeHandler]); // Dependencies for group management

  const currentUserDisplayNameRef = useRef(currentUserDisplayName);

  

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRecipient || !user) return;

    const messageId = uuidv4(); // Generate a unique ID for the message

    const optimisticMessage: MessageData = {
      id: messageId,
      content: newMessage.trim(),
      sender: 'user', // Assuming the sender is always 'user' for optimistic updates
      timestamp: new Date(),
      senderName: currentUserDisplayName,
      senderAvatar: currentUserAvatar,
    };

    // Optimistically add the message to the UI
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage(""); // Clear the input field immediately

    const messagePayload = {
      id: messageId, // Include the generated ID in the payload
      senderId: user.id,
      recipientId: selectedRecipient.id,
      text: optimisticMessage.content, // Use content from optimistic message
    };

    try {
      const response = await fetch('http://localhost:7071/api/send-to-queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messagePayload)
      });
      if (response.ok) {
        console.log("Message sent to queue with ID:", messageId);
        // No need to update state here, as the SignalR message will handle it
      } else {
        console.error("Failed to send message to queue:", response.status, response.statusText);
        // Revert optimistic update on failure
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        // Optionally, show an error message to the user
      }
    } catch (error) {
      console.error('Error sending message to queue:', error);
      // Revert optimistic update on failure
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      // Optionally, show an error message to the user
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
      {/* Contacts Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Contacts</h2>
        </div>
        <ScrollArea className="flex-1 p-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                selectedRecipient?.id === contact.id ? "bg-gray-100" : ""
              }`}
              onClick={() => setSelectedRecipient(contact)}
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={contact.picture || "/placeholder.svg"} />
                <AvatarFallback>{contact.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{contact.name}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Conditional rendering for chat area */}
        {selectedRecipient ? (
          <>
            {/* Chat Header for selected recipient */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={selectedRecipient.picture || "/placeholder.svg"} />
                <AvatarFallback>{selectedRecipient.name[0]}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{selectedRecipient.name}</h2>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-6">
                {messages.map((message) => (
                  <Message key={message.id} {...message} />
                ))}
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a contact to start chatting.
          </div>
        )}
      </div>
    </div>
  )
}
