"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Info,
  Smile,
  ImageIcon,
  Plus,
  CheckCircle2,
  Clock,
} from "lucide-react"
import NewConversationModal from "@/components/NewConversationModal"

// Mock data for users
const users = [
  {
    id: 1,
    name: "Michael Rodriguez",
    avatar: "/bearded-person.png",
    role: "Master Technician",
    status: "online",
    lastSeen: "Active now",
    unreadCount: 0,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "/short-haired-woman.png",
    role: "Service Advisor",
    status: "online",
    lastSeen: "Active now",
    unreadCount: 3,
  },
  {
    id: 3,
    name: "David Kim",
    avatar: "/asian-man-glasses.png",
    role: "Technician",
    status: "away",
    lastSeen: "Away for 15 min",
    unreadCount: 0,
  },
  {
    id: 4,
    name: "Lisa Chen",
    avatar: "/asian-woman-smiling.png",
    role: "Technician",
    status: "offline",
    lastSeen: "Last seen 2 hours ago",
    unreadCount: 0,
  },
  {
    id: 5,
    name: "James Wilson",
    avatar: "/older-man-glasses.png",
    role: "Shop Owner",
    status: "online",
    lastSeen: "Active now",
    unreadCount: 1,
  },
  {
    id: 6,
    name: "Robert Taylor",
    avatar: "/african-american-man.png",
    role: "Technician",
    status: "offline",
    lastSeen: "Last seen yesterday",
    unreadCount: 0,
  },
  {
    id: 7,
    name: "Emily Martinez",
    avatar: "/confident-latina-woman.png",
    role: "Service Writer",
    status: "online",
    lastSeen: "Active now",
    unreadCount: 0,
  },
]

// Mock data for chat groups
const chatGroups = [
  {
    id: 101,
    name: "Technician Team",
    avatar: "/diverse-group-meeting.png",
    members: [1, 3, 4, 6],
    lastMessage: {
      sender: "David Kim",
      content: "Has anyone seen the diagnostic tool?",
      time: "10:45 AM",
    },
    unreadCount: 2,
  },
  {
    id: 102,
    name: "Service Advisors",
    avatar: "/diverse-group-meeting.png",
    members: [2, 7],
    lastMessage: {
      sender: "Sarah Johnson",
      content: "Customer in bay 3 needs an update",
      time: "Yesterday",
    },
    unreadCount: 0,
  },
  {
    id: 103,
    name: "All Staff",
    avatar: "/diverse-group-meeting.png",
    members: [1, 2, 3, 4, 5, 6, 7],
    lastMessage: {
      sender: "James Wilson",
      content: "Team meeting at 4pm today",
      time: "Yesterday",
    },
    unreadCount: 0,
  },
]

// Mock data for messages
const mockMessages = [
  {
    id: 1,
    senderId: 5,
    content: "Good morning team! How's everyone doing today?",
    timestamp: "9:00 AM",
    status: "read",
  },
  {
    id: 2,
    senderId: 2,
    content: "Morning James! All good here, getting ready for the rush.",
    timestamp: "9:02 AM",
    status: "read",
  },
  {
    id: 3,
    senderId: 1,
    content: "I'm working on the BMW in bay 2. Need some help with the electrical diagnosis.",
    timestamp: "9:05 AM",
    status: "read",
  },
  {
    id: 4,
    senderId: 5,
    content: "Michael, I'll stop by in about 15 minutes to take a look.",
    timestamp: "9:07 AM",
    status: "read",
  },
  {
    id: 5,
    senderId: 1,
    content: "Thanks, James. I appreciate it.",
    timestamp: "9:08 AM",
    status: "read",
  },
  {
    id: 6,
    senderId: 3,
    content: "Has anyone seen the OBD scanner? I can't find it in the tool room.",
    timestamp: "9:15 AM",
    status: "read",
  },
  {
    id: 7,
    senderId: 7,
    content: "I think Robert was using it yesterday for the Audi.",
    timestamp: "9:17 AM",
    status: "read",
  },
  {
    id: 8,
    senderId: 2,
    content:
      "Just a heads up, we have a customer coming in at 10:30 for the Mercedes with the intermittent starting issue. Michael, can you take that one?",
    timestamp: "9:20 AM",
    status: "read",
  },
  {
    id: 9,
    senderId: 1,
    content: "Yes, I can handle that. I should be done with the BMW by then.",
    timestamp: "9:22 AM",
    status: "read",
  },
  {
    id: 10,
    senderId: 5,
    content:
      "Team, don't forget we have the parts delivery coming in around noon. Someone needs to be available to check everything in.",
    timestamp: "9:30 AM",
    status: "read",
  },
  {
    id: 11,
    senderId: 4,
    content: "I can take care of the parts delivery.",
    timestamp: "9:32 AM",
    status: "read",
  },
  {
    id: 12,
    senderId: 5,
    content: "Perfect, thanks Lisa!",
    timestamp: "9:33 AM",
    status: "read",
  },
  {
    id: 13,
    senderId: 2,
    content:
      "Just got a call from the customer with the F-150. They're asking if we can look at a new issue with the brakes while it's here.",
    timestamp: "9:40 AM",
    status: "read",
  },
  {
    id: 14,
    senderId: 5,
    content: "What's our schedule looking like? Do we have time to add that in?",
    timestamp: "9:42 AM",
    status: "read",
  },
  {
    id: 15,
    senderId: 2,
    content: "We're pretty booked, but I think David might be able to squeeze it in after his current job.",
    timestamp: "9:45 AM",
    status: "read",
  },
  {
    id: 16,
    senderId: 3,
    content: "I can take a look at it. Should be able to at least diagnose the issue even if we can't fix it today.",
    timestamp: "9:47 AM",
    status: "read",
  },
  {
    id: 17,
    senderId: 5,
    content: "Great, thanks David. Sarah, let the customer know we'll take a look.",
    timestamp: "9:50 AM",
    status: "read",
  },
  {
    id: 18,
    senderId: 2,
    content: "Will do!",
    timestamp: "9:51 AM",
    status: "read",
  },
  {
    id: 19,
    senderId: 7,
    content:
      "Just a reminder that we need to order more oil filters for the Toyota models. We're running low after yesterday.",
    timestamp: "10:00 AM",
    status: "read",
  },
  {
    id: 20,
    senderId: 5,
    content: "Thanks for the heads up, Emily. I'll place the order today.",
    timestamp: "10:05 AM",
    status: "read",
  },
]

// Status indicator component
const StatusIndicator = ({ status }: { status: string }) => {
  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    offline: "bg-gray-400",
  }

  return (
    <span
      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 ${
        statusColors[status as keyof typeof statusColors]
      }`}
    />
  )
}

// Chat message component
const ChatMessage = ({
  message,
  isCurrentUser,
  showAvatar,
  sender,
}: {
  message: any
  isCurrentUser: boolean
  showAvatar: boolean
  sender: any
}) => {
  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isCurrentUser && showAvatar ? (
        <div className="flex-shrink-0 mr-3">
          <div className="relative">
            <Image
              src={sender.avatar || "/placeholder.svg"}
              alt={sender.name}
              width={36}
              height={36}
              className="rounded-full h-9 w-9 object-cover"
            />
            <StatusIndicator status={sender.status} />
          </div>
        </div>
      ) : !isCurrentUser ? (
        <div className="w-9 mr-3"></div>
      ) : null}

      <div
        className={`max-w-[70%] ${
          isCurrentUser
            ? "bg-[#019AFF] text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-lg rounded-tr-lg rounded-br-lg"
        } px-4 py-2 shadow-sm`}
      >
        {!isCurrentUser && showAvatar && (
          <div className="font-medium text-xs text-gray-500 dark:text-gray-400 mb-1">{sender.name}</div>
        )}
        <p className="text-sm">{message.content}</p>
        <div
          className={`text-xs mt-1 ${isCurrentUser ? "text-blue-100 text-right" : "text-gray-500 dark:text-gray-400"}`}
        >
          {message.timestamp}
          {isCurrentUser && (
            <span className="ml-1">
              {message.status === "read" ? (
                <CheckCircle2 className="inline-block ml-1" size={12} />
              ) : (
                <Clock className="inline-block ml-1" size={12} />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TeamChatPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState(mockMessages)
  const [chatFilter, setChatFilter] = useState("all") // all, direct, groups
  const [isNewConversationModalOpen, setIsNewConversationModalOpen] = useState(false)
  const [chats, setChats] = useState<any[]>([...users, ...chatGroups])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Current user ID (for demo purposes)
  const currentUserId = 1 // Michael Rodriguez

  // Get the selected chat details
  const getSelectedChatDetails = () => {
    if (!selectedChat) return null

    // Check if it's a direct message (user)
    const user = chats.find((u) => u.id === selectedChat && "role" in u)
    if (user) {
      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        status: user.status,
        lastSeen: user.lastSeen,
        isGroup: false,
      }
    }

    // Check if it's a group chat
    const group = chats.find((g) => g.id === selectedChat && "members" in g)
    if (group) {
      return {
        id: group.id,
        name: group.name,
        avatar: group.avatar,
        status: "online", // Groups are always considered online
        lastSeen: `${group.members.length} members`,
        isGroup: true,
      }
    }

    return null
  }

  // Filter chats based on search query and chat filter
  const filteredChats = () => {
    let result = [...chats]

    // Filter by search query
    if (searchQuery) {
      result = result.filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Filter by chat type
    if (chatFilter === "direct") {
      result = result.filter((chat) => "role" in chat) // Only users have a role property
    } else if (chatFilter === "groups") {
      result = result.filter((chat) => "members" in chat) // Only groups have a members property
    }

    return result
  }

  // Handle sending a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChat) return

    const newMsg = {
      id: messages.length + 1,
      senderId: currentUserId,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  // Handle creating a new conversation
  const handleCreateConversation = (type: string, participants: number[], groupName?: string) => {
    if (type === "direct") {
      // For direct messages, just select the existing user
      const userId = participants[0]
      setSelectedChat(userId)
    } else if (type === "group" && groupName) {
      // For group chats, create a new group
      const newGroupId = Date.now() // Use timestamp as a unique ID
      const newGroup = {
        id: newGroupId,
        name: groupName,
        avatar: "/diverse-group-meeting.png",
        members: [currentUserId, ...participants],
        lastMessage: {
          sender: users.find((u) => u.id === currentUserId)?.name,
          content: "Group created",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
        unreadCount: 0,
      }

      setChats([...chats, newGroup])
      setSelectedChat(newGroupId)
    }
  }

  // Scroll to bottom of messages when messages change or chat is selected
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, selectedChat])

  // Get the selected chat details
  const selectedChatDetails = getSelectedChatDetails()

  return (
    <div className="p-0 h-[calc(100vh-4rem)] flex">
      {/* Left sidebar - Chat list */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Team Chat</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#019AFF]"
            />
          </div>
        </div>

        <div className="p-2 border-b border-gray-200 dark:border-gray-800 flex">
          <button
            onClick={() => setChatFilter("all")}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md ${
              chatFilter === "all"
                ? "bg-[#019AFF] text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setChatFilter("direct")}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md ${
              chatFilter === "direct"
                ? "bg-[#019AFF] text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            Direct
          </button>
          <button
            onClick={() => setChatFilter("groups")}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md ${
              chatFilter === "groups"
                ? "bg-[#019AFF] text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            Groups
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats().map((chat) => {
            const isUser = "role" in chat
            const isGroup = "members" in chat
            const unreadCount = chat.unreadCount || 0

            return (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  selectedChat === chat.id ? "bg-gray-100 dark:bg-gray-800" : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Image
                    src={chat.avatar || "/placeholder.svg"}
                    alt={chat.name}
                    width={48}
                    height={48}
                    className="rounded-full h-12 w-12 object-cover"
                  />
                  {isUser && <StatusIndicator status={chat.status} />}
                </div>
                <div className="ml-3 flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{chat.name}</h3>
                    {isUser && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {chat.lastSeen === "Active now" ? <span className="text-green-500">●</span> : chat.lastSeen}
                      </span>
                    )}
                    {isGroup && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {(chat as any).lastMessage?.time}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {isUser ? chat.role : (chat as any).lastMessage?.content}
                    </p>
                    {unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center h-5 w-5 text-xs font-medium text-white bg-[#019AFF] rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setIsNewConversationModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#019AFF] hover:bg-[#0084D8] rounded-md text-sm font-medium text-white transition-colors"
          >
            <Plus size={16} />
            <span>New Conversation</span>
          </button>
        </div>
      </div>

      {/* Right side - Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedChatDetails ? (
          <>
            {/* Chat header */}
            <div className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4">
              <div className="flex items-center">
                <div className="relative">
                  <Image
                    src={selectedChatDetails.avatar || "/placeholder.svg"}
                    alt={selectedChatDetails.name}
                    width={40}
                    height={40}
                    className="rounded-full h-10 w-10 object-cover"
                  />
                  {!selectedChatDetails.isGroup && <StatusIndicator status={selectedChatDetails.status} />}
                </div>
                <div className="ml-3">
                  <h2 className="text-sm font-medium text-gray-900 dark:text-white">{selectedChatDetails.name}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedChatDetails.lastSeen}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Phone size={18} />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Video size={18} />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Info size={18} />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900">
              {messages.map((message, index) => {
                const isCurrentUser = message.senderId === currentUserId
                const sender = users.find((u) => u.id === message.senderId)

                // Determine if we should show the avatar (first message from this sender in a sequence)
                const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId

                return (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isCurrentUser={isCurrentUser}
                    showAvatar={showAvatar}
                    sender={sender}
                  />
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Smile size={20} />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#019AFF] resize-none min-h-[40px] max-h-[120px]"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(e)
                      }
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Paperclip size={20} />
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ImageIcon size={20} />
                </button>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2 bg-[#019AFF] text-white rounded-full hover:bg-[#0084D8] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          // Empty state when no chat is selected
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center max-w-md p-6">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 inline-block mb-4">
                <MessageSquare size={32} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select a conversation</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Choose a conversation from the list or start a new one to begin chatting with your team.
              </p>
              <button
                onClick={() => setIsNewConversationModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#019AFF] hover:bg-[#0084D8] rounded-md text-sm font-medium text-white transition-colors"
              >
                <Plus size={16} />
                <span>New Conversation</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      <NewConversationModal
        isOpen={isNewConversationModalOpen}
        onClose={() => setIsNewConversationModalOpen(false)}
        onCreateConversation={handleCreateConversation}
        currentUserId={currentUserId}
      />
    </div>
  )
}

// Missing import for MessageSquare icon
function MessageSquare(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}