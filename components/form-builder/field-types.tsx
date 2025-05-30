"use client"

import type { FormField } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface FieldRendererProps {
  field: FormField
  disabled?: boolean
  value?: any
  onChange?: (value: any) => void
}

export function FieldRenderer({ field, disabled = false, value, onChange }: FieldRendererProps) {
  const handleChange = (newValue: any) => {
    if (onChange) {
      onChange(newValue)
    }
  }

  const renderField = () => {
    switch (field.type) {
      case "text":
        return (
          <Input
            type="text"
            placeholder={field.placeholder || "Enter text"}
            disabled={disabled}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full"
          />
        )

      case "email":
        return (
          <Input
            type="email"
            placeholder={field.placeholder || "Enter email"}
            disabled={disabled}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full"
          />
        )

      case "number":
        return (
          <Input
            type="number"
            placeholder={field.placeholder || "Enter number"}
            disabled={disabled}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            min={field.validation?.min}
            max={field.validation?.max}
            className="w-full"
          />
        )

      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder || "Enter text"}
            disabled={disabled}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full min-h-[100px]"
          />
        )

      case "select":
        return (
          <Select disabled={disabled} value={value} onValueChange={handleChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "radio":
        return (
          <RadioGroup disabled={disabled} value={value} onValueChange={handleChange} className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`} className="text-sm font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${index}`}
                  disabled={disabled}
                  checked={Array.isArray(value) ? value.includes(option) : false}
                  onCheckedChange={(checked) => {
                    if (Array.isArray(value)) {
                      if (checked) {
                        handleChange([...value, option])
                      } else {
                        handleChange(value.filter((v: string) => v !== option))
                      }
                    } else {
                      handleChange(checked ? [option] : [])
                    }
                  }}
                />
                <Label htmlFor={`${field.id}-${index}`} className="text-sm font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case "file":
        return (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <div className="text-sm text-muted-foreground mb-2">
              {disabled ? "File upload field" : "Click to upload or drag and drop"}
            </div>
            {!disabled && (
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            )}
          </div>
        )

      case "date":
        return (
          <Input
            type="date"
            disabled={disabled}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full"
          />
        )

      default:
        return (
          <div className="p-4 border border-dashed border-muted-foreground/25 rounded text-center text-muted-foreground">
            Unknown field type: {field.type}
          </div>
        )
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
    </div>
  )
}
