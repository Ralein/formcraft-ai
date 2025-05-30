"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { FormSchema } from "@/lib/types"
import { FormRenderer } from "@/components/form-renderer"
import { ExportDropdown } from "@/components/export-dropdown"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { downloadFile } from "@/lib/utils"

export default function FormViewPage() {
  const params = useParams()
  const router = useRouter()
  const [form, setForm] = useState<FormSchema | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (params.id) {
      fetchForm(params.id as string)
    }
  }, [params.id])

  const fetchForm = async (formId: string) => {
    try {
      const response = await fetch(`/api/forms/${formId}`)
      if (response.ok) {
        const data = await response.json()
        setForm(data)
      } else {
        router.push("/forms")
      }
    } catch (error) {
      console.error("Error fetching form:", error)
      router.push("/forms")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const response = await fetch(`/api/forms/${params.id}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      })

      if (response.ok) {
        toast({
          title: "Form submitted successfully!",
          description: "Thank you for your submission.",
        })
      } else {
        throw new Error("Failed to submit form")
      }
    } catch (error) {
      toast({
        title: "Error submitting form",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleExport = async (format: string) => {
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: params.id, format }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${form?.name || "form"}.${format}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast({
          title: "Export successful",
          description: `Form data exported as ${format.toUpperCase()}`,
        })
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleAIExport = async (format: string) => {
    try {
      const response = await fetch("/api/export/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: params.id,
          format,
          type: "summary",
        }),
      })

      if (response.ok) {
        const result = await response.json()
        downloadFile(result.content, `${form?.name || "form"}-ai-summary.${format}`, "text/plain")

        toast({
          title: "AI Export successful",
          description: `AI-powered ${format.toUpperCase()} report generated`,
        })
      }
    } catch (error) {
      toast({
        title: "AI Export failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading form...</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Form not found</h2>
          <Button asChild>
            <Link href="/forms">Back to Forms</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/forms">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">{form.name}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ExportDropdown onExport={handleExport} onAIExport={handleAIExport} />
            <Button variant="outline" asChild>
              <Link href={`/entries/${form.id}`}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <FormRenderer form={form} onSubmit={handleSubmit} />
      </main>
    </div>
  )
}
