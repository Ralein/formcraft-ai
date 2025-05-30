"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, Table, Code, Sparkles } from "lucide-react"
import { EXPORT_FORMATS } from "@/lib/types"

interface ExportDropdownProps {
  onExport: (format: string) => void
  onAIExport: (format: string) => void
  disabled?: boolean
}

export function ExportDropdown({ onExport, onAIExport, disabled }: ExportDropdownProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: string, isAI = false) => {
    setIsExporting(true)
    try {
      if (isAI) {
        await onAIExport(format)
      } else {
        await onExport(format)
      }
    } finally {
      setIsExporting(false)
    }
  }

  const getIcon = (format: string) => {
    if (["pdf", "docx", "odt", "txt", "html"].includes(format)) {
      return <FileText className="w-4 h-4" />
    }
    if (["csv", "xlsx", "xls"].includes(format)) {
      return <Table className="w-4 h-4" />
    }
    return <Code className="w-4 h-4" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled || isExporting}>
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Standard Export</DropdownMenuLabel>
        {EXPORT_FORMATS.map((format) => (
          <DropdownMenuItem
            key={format.value}
            onClick={() => handleExport(format.value)}
            className="flex items-center gap-2"
          >
            {getIcon(format.value)}
            {format.label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI-Powered Export
        </DropdownMenuLabel>
        {["pdf", "txt", "html", "psi"].map((format) => {
          const formatInfo = EXPORT_FORMATS.find((f) => f.value === format)
          return (
            <DropdownMenuItem
              key={`ai-${format}`}
              onClick={() => handleExport(format, true)}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              AI {formatInfo?.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
