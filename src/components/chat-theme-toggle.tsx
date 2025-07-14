"use client"

import * as React from "react"
import { Icon } from "@iconify/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ChatThemeToggle() {
  const { theme, setTheme } = useTheme()

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return "feather:sun"
      case "dark":
        return "feather:moon"
      case "system":
        return "feather:monitor"
      default:
        return "feather:monitor"
    }
  }

  // Get only the non-active themes for dropdown
  const getOtherThemes = () => {
    const allThemes = [
      { key: "light", label: "Light", icon: "feather:sun" },
      { key: "dark", label: "Dark", icon: "feather:moon" },
      { key: "system", label: "System", icon: "feather:monitor" }
    ]
    return allThemes.filter(t => t.key !== theme)
  }

  const otherThemes = getOtherThemes()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 px-0 text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <Icon icon={getThemeIcon()} className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {otherThemes.map((themeOption) => (
          <DropdownMenuItem 
            key={themeOption.key}
            onClick={() => setTheme(themeOption.key as any)}
            className="flex items-center gap-2"
          >
            <Icon icon={themeOption.icon} className="h-4 w-4" />
            <span>{themeOption.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}