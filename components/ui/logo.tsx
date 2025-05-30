"use client"

import { Sparkles } from "lucide-react"

interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full animate-pulse" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FormCraft
          </span>
          <span className="text-xs text-muted-foreground -mt-1">AI</span>
        </div>
      )}
    </div>
  )
}
