"use client"

import type React from "react"
import { useState } from "react"
import type { FormSchema } from "@/lib/types"
import { FieldRenderer } from "./form-builder/field-types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface FormRendererProps {
  form: FormSchema
  onSubmit: (data: Record<string, any>) => Promise<void>
}

export function FormRenderer({ form, onSubmit }: FormRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    form.fields.forEach((field) => {
      const value = formData[field.id]

      if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
        newErrors[field.id] = `${field.label} is required`
      }

      if (field.type === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
        newErrors[field.id] = "Please enter a valid email address"
      }

      if (field.validation) {
        if (field.validation.min !== undefined) {
          if (field.type === "number" && value < field.validation.min) {
            newErrors[field.id] = `Minimum value is ${field.validation.min}`
          } else if (typeof value === "string" && value.length < field.validation.min) {
            newErrors[field.id] = `Minimum length is ${field.validation.min} characters`
          }
        }

        if (field.validation.max !== undefined) {
          if (field.type === "number" && value > field.validation.max) {
            newErrors[field.id] = `Maximum value is ${field.validation.max}`
          } else if (typeof value === "string" && value.length > field.validation.max) {
            newErrors[field.id] = `Maximum length is ${field.validation.max} characters`
          }
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setFormData({})
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{form.name}</CardTitle>
        {form.description && <p className="text-muted-foreground">{form.description}</p>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.map((field) => (
            <div key={field.id}>
              <FieldRenderer
                field={field}
                value={formData[field.id]}
                onChange={(value) => handleFieldChange(field.id, value)}
              />
              {errors[field.id] && <p className="text-sm text-destructive mt-1">{errors[field.id]}</p>}
            </div>
          ))}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Form"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
