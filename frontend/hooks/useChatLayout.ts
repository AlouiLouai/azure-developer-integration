
"use client"

import { useState } from "react"

export const useChatLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return { isSidebarOpen, toggleSidebar }
}
