
"use client"

import { useState, useRef, useEffect } from "react"

export const useSharedChannelHeader = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return { searchQuery, setSearchQuery, isDropdownOpen, setIsDropdownOpen, dropdownRef }
}
