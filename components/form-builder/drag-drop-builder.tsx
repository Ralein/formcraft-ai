"use client"

import { useState } from "react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragOverEvent,
} from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { FormField } from "@/lib/types"
import { FieldPalette } from "./field-palette"
import { SortableField } from "./sortable-field"
import { FieldEditor } from "./field-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Eye, Wand2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface FormBuilderProps {
  onSave: (formData: { name: string; description: string; fields: FormField[] }) => void
  onPreview: (fields: FormField[]) => void
}

export function DragDropBuilder({ onSave, onPreview }: FormBuilderProps) {
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [fields, setFields] = useState<FormField[]>([])
  const [activeField, setActiveField] = useState<FormField | null>(null)
  const [editingField, setEditingField] = useState<FormField | null>(null)
  const [isOverDropZone, setIsOverDropZone] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  )

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: "form-builder-drop-zone",
  })

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    console.log("🚀 Drag started:", active.id, active.data.current)

    if (active.data.current?.type === "field-type") {
      const fieldType = active.id as FormField["type"]
      const newField: FormField = {
        id: uuidv4(),
        type: fieldType,
        label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
        required: false,
        ...(fieldType === "select" || fieldType === "radio" || fieldType === "checkbox"
          ? { options: ["Option 1", "Option 2"] }
          : {}),
      }
      setActiveField(newField)
    } else {
      const field = fields.find((f) => f.id === active.id)
      setActiveField(field || null)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    setIsOverDropZone(over?.id === "form-builder-drop-zone")
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    console.log("🎯 Drag ended:", active.id, "over:", over?.id)
    setIsOverDropZone(false)

    if (!over) {
      console.log("❌ No drop target")
      setActiveField(null)
      return
    }

    // Handle dropping a new field type
    if (active.data.current?.type === "field-type") {
      if (over.id === "form-builder-drop-zone") {
        const fieldType = active.id as FormField["type"]
        const newField: FormField = {
          id: uuidv4(),
          type: fieldType,
          label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
          required: false,
          ...(fieldType === "select" || fieldType === "radio" || fieldType === "checkbox"
            ? { options: ["Option 1", "Option 2"] }
            : {}),
        }

        console.log("✅ Adding new field:", newField)
        setFields((prev) => {
          const newFields = [...prev, newField]
          console.log("📝 Updated fields:", newFields)
          return newFields
        })
      }
    }
    // Handle reordering existing fields
    else {
      const activeIndex = fields.findIndex((f) => f.id === active.id)
      const overIndex = fields.findIndex((f) => f.id === over.id)

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        console.log("🔄 Reordering fields")
        setFields((prev) => arrayMove(prev, activeIndex, overIndex))
      }
    }

    setActiveField(null)
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    console.log("📝 Updating field:", fieldId, updates)
    setFields((prev) => prev.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)))
  }

  const deleteField = (fieldId: string) => {
    console.log("🗑️ Deleting field:", fieldId)
    setFields((prev) => prev.filter((field) => field.id !== fieldId))
    setEditingField(null)
  }

  const handleSave = () => {
    if (!formName.trim()) {
      alert("Please enter a form name")
      return
    }
    console.log("💾 Saving form:", { name: formName, description: formDescription, fields })
    onSave({ name: formName, description: formDescription, fields })
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        {/* Field Palette */}
        <div className="w-80 border-r border-border/50 bg-card/50 backdrop-blur-sm p-6 overflow-y-auto">
          <FieldPalette />
        </div>

        {/* Form Builder */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Form Settings */}
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Wand2 className="w-5 h-5 text-blue-500" />
                  Form Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="form-name" className="text-sm font-medium">
                      Form Name *
                    </Label>
                    <Input
                      id="form-name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Enter form name"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="form-description" className="text-sm font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="form-description"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Enter form description"
                      className="min-h-[44px] resize-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Fields */}
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-blue-500 rounded"></div>
                  Form Fields ({fields.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div
                  ref={setDroppableRef}
                  id="form-builder-drop-zone"
                  className={`min-h-[500px] space-y-4 p-8 border-2 border-dashed rounded-xl transition-all duration-200 ${
                    isOverDropZone || isOver
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.02] shadow-lg"
                      : "border-muted-foreground/25 hover:border-blue-400/50"
                  }`}
                >
                  {fields.length === 0 ? (
                    <div className="text-center text-muted-foreground py-20">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                        <Wand2 className="w-12 h-12 text-blue-500" />
                      </div>
                      <div className="text-xl font-medium mb-2">Drop fields here to build your form</div>
                      <div className="text-sm">Drag field types from the left panel to get started</div>
                      <div className="text-xs mt-2 opacity-75">
                        {isOverDropZone || isOver ? "🎯 Release to drop!" : "👆 Drag a field here"}
                      </div>
                    </div>
                  ) : (
                    <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-4">
                        {fields.map((field) => (
                          <SortableField key={field.id} field={field} onEdit={setEditingField} onDelete={deleteField} />
                        ))}
                      </div>
                    </SortableContext>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleSave}
                size="lg"
                disabled={!formName.trim() || fields.length === 0}
                className="flex items-center gap-2 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                Save Form
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onPreview(fields)}
                disabled={fields.length === 0}
                className="flex items-center gap-2 px-8 disabled:opacity-50"
              >
                <Eye className="w-5 h-5" />
                Preview
              </Button>
            </div>
          </div>
        </div>

        {/* Field Editor */}
        {editingField && (
          <div className="w-96 border-l border-border/50 bg-card/50 backdrop-blur-sm p-6 overflow-y-auto">
            <FieldEditor
              field={editingField}
              onUpdate={(updates) => {
                updateField(editingField.id, updates)
                setEditingField({ ...editingField, ...updates })
              }}
              onClose={() => setEditingField(null)}
            />
          </div>
        )}
      </div>

      <DragOverlay>
        {activeField ? (
          <div className="bg-card border-2 border-blue-500 rounded-xl p-4 shadow-2xl opacity-95 transform rotate-3 scale-105">
            <div className="font-medium text-blue-600">{activeField.label}</div>
            <div className="text-sm text-muted-foreground capitalize">{activeField.type} field</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
