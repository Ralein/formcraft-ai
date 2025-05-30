"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DragDropBuilder } from "@/components/form-builder/drag-drop-builder"
import { FormRenderer } from "@/components/form-renderer"
import type { FormField } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"

export default function BuilderPage() {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [previewFields, setPreviewFields] = useState<FormField[]>([])
  const router = useRouter()
  const { toast } = useToast()

  const handleSave = async (formData: { name: string; description: string; fields: FormField[] }) => {
    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const savedForm = await response.json()
        toast({
          title: "Form saved successfully!",
          description: "Your form has been created and is ready to use.",
        })
        router.push(`/forms/${savedForm.id}`)
      } else {
        throw new Error("Failed to save form")
      }
    } catch (error) {
      toast({
        title: "Error saving form",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handlePreview = (fields: FormField[]) => {
    setPreviewFields(fields)
    setIsPreviewMode(true)
  }

  const mockPreviewForm = {
    id: "preview",
    name: "Form Preview",
    description: "This is a preview of your form",
    fields: previewFields,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Logo />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center gap-2"
            >
              {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPreviewMode ? "Exit Preview" : "Preview"}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {isPreviewMode ? (
        <div className="container mx-auto px-4 py-8">
          <FormRenderer
            form={mockPreviewForm}
            onSubmit={async (data) => {
              console.log("Preview form data:", data)
              toast({
                title: "Preview submission",
                description: "This is just a preview. Data was not saved.",
              })
            }}
          />
        </div>
      ) : (
        <DragDropBuilder onSave={handleSave} onPreview={handlePreview} />
      )}
    </div>
  )
}
