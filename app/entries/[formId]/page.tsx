"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import type { FormSchema, FormEntry } from "@/lib/types"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { ExportDropdown } from "@/components/export-dropdown"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function EntriesPage() {
  const params = useParams()
  const [form, setForm] = useState<FormSchema | null>(null)
  const [entries, setEntries] = useState<FormEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (params.formId) {
      fetchData(params.formId as string)
    }
  }, [params.formId])

  const fetchData = async (formId: string) => {
    try {
      const [formResponse, entriesResponse] = await Promise.all([
        fetch(`/api/forms/${formId}`),
        fetch(`/api/entries/${formId}`),
      ])

      if (formResponse.ok && entriesResponse.ok) {
        const [formData, entriesData] = await Promise.all([formResponse.json(), entriesResponse.json()])
        setForm(formData)
        setEntries(entriesData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format: string) => {
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: params.formId, format }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${form?.name || "form"}-entries.${format}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast({
          title: "Export successful",
          description: `Entries exported as ${format.toUpperCase()}`,
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
          formId: params.formId,
          format,
          type: "analysis",
        }),
      })

      if (response.ok) {
        const result = await response.json()
        const blob = new Blob([result.content], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${form?.name || "form"}-ai-analysis.${format}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast({
          title: "AI Analysis complete",
          description: `AI-powered ${format.toUpperCase()} analysis generated`,
        })
      }
    } catch (error) {
      toast({
        title: "AI Analysis failed",
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
          <p>Loading analytics...</p>
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
            <h1 className="text-xl font-semibold">{form.name} - Analytics</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ExportDropdown onExport={handleExport} onAIExport={handleAIExport} disabled={entries.length === 0} />
            <Button variant="outline" asChild>
              <Link href={`/forms/${form.id}`}>
                <Eye className="w-4 h-4 mr-2" />
                View Form
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {entries.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No submissions yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This form hasn't received any submissions yet. Share your form to start collecting responses.
              </p>
              <Button asChild>
                <Link href={`/forms/${form.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Form
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <AnalyticsDashboard form={form} entries={entries} />
        )}

        {/* Recent Entries */}
        {entries.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium">Entry #{entry.id.slice(0, 8)}</span>
                      <span className="text-sm text-muted-foreground">{formatDate(entry.createdAt)}</span>
                    </div>
                    <div className="grid gap-2">
                      {form.fields.slice(0, 3).map((field) => (
                        <div key={field.id} className="text-sm">
                          <span className="font-medium">{field.label}:</span>{" "}
                          <span className="text-muted-foreground">{entry.data[field.id] || "No response"}</span>
                        </div>
                      ))}
                      {form.fields.length > 3 && (
                        <div className="text-sm text-muted-foreground">+{form.fields.length - 3} more fields</div>
                      )}
                    </div>
                  </div>
                ))}
                {entries.length > 5 && (
                  <div className="text-center text-muted-foreground">And {entries.length - 5} more submissions...</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
