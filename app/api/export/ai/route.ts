import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formId, format, type } = body

    if (!formId || !format || !type) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const [form, entries] = await Promise.all([db.getForm(formId), db.getEntries(formId)])

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    // Mock AI analysis - In production, integrate with OpenAI or Ollama
    const aiAnalysis = generateMockAIAnalysis(form, entries, type)

    // Save the generated template
    await db.createTemplate({
      formId,
      name: `AI ${type} - ${new Date().toLocaleDateString()}`,
      content: aiAnalysis,
      format,
    })

    return NextResponse.json({ content: aiAnalysis })
  } catch (error) {
    console.error("Error generating AI export:", error)
    return NextResponse.json({ error: "Failed to generate AI export" }, { status: 500 })
  }
}

function generateMockAIAnalysis(form: any, entries: any[], type: string): string {
  const totalEntries = entries.length
  const completionRates = form.fields.map((field: any) => {
    const completed = entries.filter((entry) => entry.data[field.id]).length
    return Math.round((completed / totalEntries) * 100)
  })
  const avgCompletion = Math.round(completionRates.reduce((a, b) => a + b, 0) / completionRates.length)

  switch (type) {
    case "summary":
      return `AI FORM SUMMARY REPORT

Form: ${form.name}
Generated: ${new Date().toLocaleString()}

OVERVIEW:
This form has received ${totalEntries} submissions with an average completion rate of ${avgCompletion}%.

KEY INSIGHTS:
• The form contains ${form.fields.length} fields covering various data types
• User engagement appears ${avgCompletion > 80 ? "high" : avgCompletion > 60 ? "moderate" : "low"} based on completion rates
• ${form.fields.filter((f: any) => f.required).length} fields are marked as required

RECOMMENDATIONS:
${avgCompletion < 70 ? "• Consider reducing form length to improve completion rates" : "• Current form length appears optimal"}
• Monitor submission patterns to identify peak usage times
• Consider A/B testing different field arrangements

FIELD ANALYSIS:
${form.fields
  .map((field: any, index: number) => `• ${field.label}: ${completionRates[index]}% completion rate`)
  .join("\n")}

This analysis was generated using AI to provide insights into form performance and user behavior patterns.`

    case "analysis":
      return `DETAILED FORM ANALYSIS

Form: ${form.name}
Analysis Date: ${new Date().toLocaleString()}
Total Submissions: ${totalEntries}

STATISTICAL OVERVIEW:
Average Completion Rate: ${avgCompletion}%
Peak Submission Day: ${entries.length > 0 ? new Date(entries[entries.length - 1].createdAt).toDateString() : "N/A"}
Form Complexity Score: ${form.fields.length > 10 ? "High" : form.fields.length > 5 ? "Medium" : "Low"}

FIELD-BY-FIELD BREAKDOWN:
${form.fields
  .map((field: any, index: number) => {
    const values = entries.map((entry) => entry.data[field.id]).filter((v) => v)
    return `
${field.label} (${field.type}):
  - Completion Rate: ${completionRates[index]}%
  - Response Count: ${values.length}
  - Field Type: ${field.type}
  - Required: ${field.required ? "Yes" : "No"}`
  })
  .join("\n")}

USER BEHAVIOR INSIGHTS:
• Form abandonment appears ${avgCompletion > 80 ? "minimal" : "significant"}
• Field complexity may be ${form.fields.filter((f: any) => ["select", "checkbox", "radio"].includes(f.type)).length > form.fields.length / 2 ? "high" : "appropriate"}
• User engagement trends suggest ${totalEntries > 50 ? "strong" : "moderate"} form adoption

OPTIMIZATION OPPORTUNITIES:
1. Review fields with completion rates below 70%
2. Consider progressive disclosure for complex forms
3. Implement field validation to reduce errors
4. Add progress indicators for longer forms

This comprehensive analysis provides actionable insights for form optimization.`

    default:
      return `AI Report for ${form.name}\n\nGenerated: ${new Date().toLocaleString()}\nTotal Submissions: ${totalEntries}\nAverage Completion: ${avgCompletion}%`
  }
}
