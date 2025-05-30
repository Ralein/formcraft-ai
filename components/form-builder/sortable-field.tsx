"use client"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { FormField } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { GripVertical, Edit, Trash2 } from "lucide-react"
import { FieldRenderer } from "./field-types"

interface SortableFieldProps {
  field: FormField
  onEdit: (field: FormField) => void
  onDelete: (fieldId: string) => void
}

export function SortableField({ field, onEdit, onDelete }: SortableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className={`${isDragging ? "opacity-50 scale-105 rotate-1" : ""}`}>
      <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-200 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing mt-2 p-1 rounded hover:bg-muted/50 transition-colors"
          >
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="flex-1">
            <FieldRenderer field={field} disabled />
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(field)}
              className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(field.id)}
              className="h-9 w-9 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
