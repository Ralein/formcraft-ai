"use client"

import type React from "react"
import { useDraggable } from "@dnd-kit/core"
import type { FormField } from "@/lib/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Type, Mail, Hash, FileText, ChevronDown, Circle, Square, Upload, Calendar, Sparkles } from "lucide-react"

const fieldTypes: Array<{
  type: FormField["type"]
  label: string
  icon: React.ReactNode
  description: string
  color: string
}> = [
  {
    type: "text",
    label: "Text Input",
    icon: <Type className="w-5 h-5" />,
    description: "Single line text input",
    color: "from-blue-500 to-blue-600",
  },
  {
    type: "email",
    label: "Email",
    icon: <Mail className="w-5 h-5" />,
    description: "Email address input",
    color: "from-green-500 to-green-600",
  },
  {
    type: "number",
    label: "Number",
    icon: <Hash className="w-5 h-5" />,
    description: "Numeric input",
    color: "from-purple-500 to-purple-600",
  },
  {
    type: "textarea",
    label: "Textarea",
    icon: <FileText className="w-5 h-5" />,
    description: "Multi-line text input",
    color: "from-orange-500 to-orange-600",
  },
  {
    type: "select",
    label: "Select",
    icon: <ChevronDown className="w-5 h-5" />,
    description: "Dropdown selection",
    color: "from-pink-500 to-pink-600",
  },
  {
    type: "radio",
    label: "Radio Group",
    icon: <Circle className="w-5 h-5" />,
    description: "Single choice selection",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    type: "checkbox",
    label: "Checkbox Group",
    icon: <Square className="w-5 h-5" />,
    description: "Multiple choice selection",
    color: "from-teal-500 to-teal-600",
  },
  {
    type: "file",
    label: "File Upload",
    icon: <Upload className="w-5 h-5" />,
    description: "File upload input",
    color: "from-red-500 to-red-600",
  },
  {
    type: "date",
    label: "Date",
    icon: <Calendar className="w-5 h-5" />,
    description: "Date picker input",
    color: "from-cyan-500 to-cyan-600",
  },
]

function DraggableFieldType({
  type,
  label,
  icon,
  description,
  color,
}: {
  type: FormField["type"]
  label: string
  icon: React.ReactNode
  description: string
  color: string
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: type,
    data: {
      type: "field-type",
      fieldType: type,
    },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group relative p-4 border-2 border-transparent rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-105 hover:shadow-lg ${
        isDragging ? "opacity-50 scale-110 rotate-3" : "hover:border-white/20"
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 rounded-xl group-hover:opacity-20 transition-opacity`}
      />
      <div className="relative pointer-events-none">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${color} text-white shadow-sm`}>{icon}</div>
          <span className="font-semibold text-sm">{label}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

export function FieldPalette() {
  return (
    <Card className="h-full shadow-lg border-0 bg-card/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Field Types
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-6">
        <div className="text-sm text-muted-foreground mb-4">
          💡 <strong>Tip:</strong> Drag any field type to the form builder area
        </div>
        {fieldTypes.map((fieldType) => (
          <DraggableFieldType key={fieldType.type} {...fieldType} />
        ))}
      </CardContent>
    </Card>
  )
}
