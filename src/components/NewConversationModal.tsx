"use client"

import { useState } from "react"
import { X, User, Users, Search } from "lucide-react"

interface NewConversationModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateConversation: (type: string, participants: number[], groupName?: string) => void
  currentUserId: number
}

// Mock users data for the modal
const mockUsers = [
  { id: 2, name: "Sarah Johnson", role: "Service Advisor", avatar: "/short-haired-woman.png" },
  { id: 3, name: "David Kim", role: "Technician", avatar: "/asian-man-glasses.png" },
  { id: 4, name: "Lisa Chen", role: "Technician", avatar: "/asian-woman-smiling.png" },
  { id: 5, name: "James Wilson", role: "Shop Owner", avatar: "/older-man-glasses.png" },
  { id: 6, name: "Robert Taylor", role: "Technician", avatar: "/african-american-man.png" },
  { id: 7, name: "Emily Martinez", role: "Service Writer", avatar: "/confident-latina-woman.png" },
]

export default function NewConversationModal({
  isOpen,
  onClose,
  onCreateConversation,
  currentUserId,
}: NewConversationModalProps) {
  const [conversationType, setConversationType] = useState<"direct" | "group">("direct")
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [groupName, setGroupName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter users based on search query and exclude current user
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.id !== currentUserId &&
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUserToggle = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (conversationType === "direct" && selectedUsers.length === 1) {
      onCreateConversation("direct", selectedUsers)
    } else if (conversationType === "group" && selectedUsers.length > 0 && groupName.trim()) {
      onCreateConversation("group", selectedUsers, groupName)
    }
    
    // Reset form
    setSelectedUsers([])
    setGroupName("")
    setSearchQuery("")
    onClose()
  }

  const canSubmit = 
    (conversationType === "direct" && selectedUsers.length === 1) ||
    (conversationType === "group" && selectedUsers.length > 0 && groupName.trim())

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              New Conversation
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Conversation Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Conversation Type
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setConversationType("direct")
                    setSelectedUsers([])
                    setGroupName("")
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border ${
                    conversationType === "direct"
                      ? "bg-[#019AFF] border-[#019AFF] text-white"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <User size={18} />
                  Direct Message
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConversationType("group")
                    setSelectedUsers([])
                    setGroupName("")
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border ${
                    conversationType === "group"
                      ? "bg-[#019AFF] border-[#019AFF] text-white"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <Users size={18} />
                  Group Chat
                </button>
              </div>
            </div>

            {/* Group Name (only for groups) */}
            {conversationType === "group" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name..."
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF]"
                />
              </div>
            )}

            {/* Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {conversationType === "direct" ? "Select Person" : "Select Team Members"}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search team members..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF]"
                />
              </div>
            </div>

            {/* User List */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedUsers.includes(user.id)
                      ? "bg-[#019AFF]/10 border border-[#019AFF]"
                      : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    if (conversationType === "direct") {
                      setSelectedUsers([user.id])
                    } else {
                      handleUserToggle(user.id)
                    }
                  }}
                >
                  <div className="flex-shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.role}
                    </p>
                  </div>
                  {conversationType === "group" && (
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserToggle(user.id)}
                        className="rounded border-gray-300 text-[#019AFF] focus:ring-[#019AFF]"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Selection Info */}
            {conversationType === "direct" && selectedUsers.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Start a conversation with {filteredUsers.find(u => u.id === selectedUsers[0])?.name}
                </p>
              </div>
            )}

            {conversationType === "group" && selectedUsers.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {selectedUsers.length} member{selectedUsers.length > 1 ? "s" : ""} selected
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-[#019AFF] hover:bg-[#0084D8] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Conversation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}