"use client"

import * as React from "react"
import { Icon } from "@iconify/react"
import { useTheme } from "@/components/theme-provider"

interface ThemeSelectorProps {
  showToggle?: boolean
  showCurrentState?: boolean
}

export function ThemeSelector({ showToggle = true, showCurrentState = true }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme()

  const getThemeDisplay = () => {
    switch (theme) {
      case "light":
        return { label: "Light", icon: "feather:sun" }
      case "dark":
        return { label: "Dark", icon: "feather:moon" }
      case "system":
        return { label: "System", icon: "feather:monitor" }
      default:
        return { label: "System", icon: "feather:monitor" }
    }
  }

  const currentTheme = getThemeDisplay()

  // Get only the non-active themes
  const getAvailableThemes = () => {
    const allThemes = [
      { key: "light", label: "Light", icon: "feather:sun" },
      { key: "dark", label: "Dark", icon: "feather:moon" },
      { key: "system", label: "System", icon: "feather:monitor" }
    ]
    return allThemes.filter(t => t.key !== theme)
  }

  const availableThemes = getAvailableThemes()

  return (
    <div className="space-y-2">
      {/* Current Theme State */}
      {showCurrentState && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Display Theme
          </span>
          <div className="flex items-center gap-2 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
            <Icon icon={currentTheme.icon} className="h-3 w-3 text-gray-600 dark:text-gray-400" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {currentTheme.label}
            </span>
          </div>
        </div>
      )}

      {/* Visual Toggle - Only show non-active themes */}
      {showToggle && (
        <div className="flex w-full">
          {availableThemes.map((themeOption, index) => (
            <button
              key={themeOption.key}
              onClick={() => setTheme(themeOption.key as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all text-xs font-medium ${
                index === 0 ? 'rounded-l' : ''
              } ${
                index === availableThemes.length - 1 ? 'rounded-r' : ''
              } ${
                index > 0 ? 'border-l-0' : ''
              }`}
            >
              <Icon icon={themeOption.icon} className="h-3.5 w-3.5" />
              <span>{themeOption.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}