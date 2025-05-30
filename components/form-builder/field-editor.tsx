"use client"

import { useState } from "react"
import type { FormField } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, Trash2, Settings } from "lucide-react"

interface FieldEditorProps {
  field: FormField
  onUpdate: (updates: Partial<FormField>) => void
  onClose: () => void
}

export function FieldEditor({ field, onUpdate, onClose }: FieldEditorProps) {
  const [localField, setLocalField] = useState(field)

  const handleUpdate = (updates: Partial<FormField>) => {
    const newField = { ...localField, ...updates }
    setLocalField(newField)
    onUpdate(updates)
  }

  const addOption = () => {
    const newOptions = [...(localField.options || []), `Option ${(localField.options?.length || 0) + 1}`]
    handleUpdate({ options: newOptions })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(localField.options || [])]
    newOptions[index] = value
    handleUpdate({ options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = localField.options?.filter((_, i) => i !== index) || []
    handleUpdate({ options: newOptions })
  }

  const hasOptions = ["select", "radio", "checkbox"].includes(localField.type)

  return (
    <Card className="h-full shadow-lg border-0 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="w-5 h-5 text-orange-500" />
          Edit Field
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <Label htmlFor="field-label" className="text-sm font-medium">
            Label
          </Label>
          <Input
            id="field-label"
            value={localField.label}
            onChange={(e) => handleUpdate({ label: e.target.value })}
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field-placeholder" className="text-sm font-medium">
            Placeholder
          </Label>
          <Input
            id="field-placeholder"
            value={localField.placeholder || ""}
            onChange={(e) => handleUpdate({ placeholder: e.target.value })}
            className="h-10"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
          <Label htmlFor="field-required" className="text-sm font-medium">
            Required field
          </Label>
          <Switch
            id="field-required"
            checked={localField.required || false}
            onCheckedChange={(checked) => handleUpdate({ required: checked })}
          />
        </div>

        {hasOptions && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Options</Label>
              <Button variant="outline" size="sm" onClick={addOption} className="h-8">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-3">
              {localField.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="h-9"
                  />
                  <Button variant="outline" size="sm" onClick={() => removeOption(index)} className="h-9 w-9 p-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {(localField.type === "text" || localField.type === "number") && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="field-min" className="text-sm font-medium">
                Minimum {localField.type === "number" ? "Value" : "Length"}
              </Label>
              <Input
                id="field-min"
                type="number"
                value={localField.validation?.min || ""}
                onChange={(e) =>
                  handleUpdate({
                    validation: {
                      ...localField.validation,
                      min: e.target.value ? Number.parseInt(e.target.value) : undefined,
                    },
                  })
                }
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field-max" className="text-sm font-medium">
                Maximum {localField.type === "number" ? "Value" : "Length"}
              </Label>
              <Input
                id="field-max"
                type="number"
                value={localField.validation?.max || ""}
                onChange={(e) =>
                  handleUpdate({
                    validation: {
                      ...localField.validation,
                      max: e.target.value ? Number.parseInt(e.target.value) : undefined,
                    },
                  })
                }
                className="h-10"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
