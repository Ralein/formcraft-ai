import type { FormEntry, FormSchema } from "./types"
import { Parser } from "json2csv"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"

export class ExportService {
  static async exportToCSV(entries: FormEntry[], form: FormSchema): Promise<string> {
    if (entries.length === 0) return ""

    const fields = form.fields.map((field) => ({
      label: field.label,
      value: field.id,
    }))

    const data = entries.map((entry) => {
      const row: any = { id: entry.id, createdAt: entry.createdAt }
      form.fields.forEach((field) => {
        row[field.id] = entry.data[field.id] || ""
      })
      return row
    })

    const parser = new Parser({
      fields: [{ label: "Entry ID", value: "id" }, { label: "Created At", value: "createdAt" }, ...fields],
    })

    return parser.parse(data)
  }

  static async exportToExcel(entries: FormEntry[], form: FormSchema): Promise<ArrayBuffer> {
    const data = entries.map((entry) => {
      const row: any = {
        "Entry ID": entry.id,
        "Created At": new Date(entry.createdAt).toLocaleString(),
      }
      form.fields.forEach((field) => {
        row[field.label] = entry.data[field.id] || ""
      })
      return row
    })

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, form.name)

    return XLSX.write(workbook, { bookType: "xlsx", type: "array" })
  }

  static async exportToPDF(entries: FormEntry[], form: FormSchema): Promise<ArrayBuffer> {
    const pdf = new jsPDF()

    // Title
    pdf.setFontSize(20)
    pdf.text(form.name, 20, 30)

    // Description
    if (form.description) {
      pdf.setFontSize(12)
      pdf.text(form.description, 20, 45)
    }

    let yPosition = 60

    entries.forEach((entry, index) => {
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = 30
      }

      pdf.setFontSize(14)
      pdf.text(`Entry ${index + 1}`, 20, yPosition)
      yPosition += 10

      pdf.setFontSize(10)
      pdf.text(`Created: ${new Date(entry.createdAt).toLocaleString()}`, 20, yPosition)
      yPosition += 15

      form.fields.forEach((field) => {
        if (yPosition > 270) {
          pdf.addPage()
          yPosition = 30
        }

        pdf.setFontSize(10)
        pdf.text(`${field.label}:`, 20, yPosition)
        const value = entry.data[field.id] || "N/A"
        pdf.text(String(value), 80, yPosition)
        yPosition += 8
      })

      yPosition += 10
    })

    return pdf.output("arraybuffer")
  }

  static async exportToJSON(entries: FormEntry[], form: FormSchema): Promise<string> {
    return JSON.stringify(
      {
        form: {
          id: form.id,
          name: form.name,
          description: form.description,
          fields: form.fields,
        },
        entries: entries,
        exportedAt: new Date().toISOString(),
        totalEntries: entries.length,
      },
      null,
      2,
    )
  }

  static async exportToXML(entries: FormEntry[], form: FormSchema): Promise<string> {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += `<form id="${form.id}" name="${form.name}">\n`

    if (form.description) {
      xml += `  <description>${form.description}</description>\n`
    }

    xml += "  <entries>\n"

    entries.forEach((entry) => {
      xml += `    <entry id="${entry.id}" createdAt="${entry.createdAt}">\n`
      form.fields.forEach((field) => {
        const value = entry.data[field.id] || ""
        xml += `      <${field.id} label="${field.label}">${value}</${field.id}>\n`
      })
      xml += "    </entry>\n"
    })

    xml += "  </entries>\n"
    xml += "</form>"

    return xml
  }

  static async exportToYAML(entries: FormEntry[], form: FormSchema): Promise<string> {
    let yaml = `form:\n`
    yaml += `  id: "${form.id}"\n`
    yaml += `  name: "${form.name}"\n`

    if (form.description) {
      yaml += `  description: "${form.description}"\n`
    }

    yaml += `  fields:\n`
    form.fields.forEach((field) => {
      yaml += `    - id: "${field.id}"\n`
      yaml += `      label: "${field.label}"\n`
      yaml += `      type: "${field.type}"\n`
    })

    yaml += `entries:\n`
    entries.forEach((entry) => {
      yaml += `  - id: "${entry.id}"\n`
      yaml += `    createdAt: "${entry.createdAt}"\n`
      yaml += `    data:\n`
      form.fields.forEach((field) => {
        const value = entry.data[field.id] || ""
        yaml += `      ${field.id}: "${value}"\n`
      })
    })

    return yaml
  }

  static async exportToHTML(entries: FormEntry[], form: FormSchema): Promise<string> {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${form.name} - Form Entries</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .entry { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .field { margin: 5px 0; }
        .label { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${form.name}</h1>
        ${form.description ? `<p>${form.description}</p>` : ""}
        <p>Total Entries: ${entries.length}</p>
        <p>Exported: ${new Date().toLocaleString()}</p>
    </div>`

    if (entries.length > 0) {
      html += `<table>
        <thead>
            <tr>
                <th>Entry ID</th>
                <th>Created At</th>`

      form.fields.forEach((field) => {
        html += `<th>${field.label}</th>`
      })

      html += `</tr>
        </thead>
        <tbody>`

      entries.forEach((entry) => {
        html += `<tr>
            <td>${entry.id}</td>
            <td>${new Date(entry.createdAt).toLocaleString()}</td>`

        form.fields.forEach((field) => {
          const value = entry.data[field.id] || ""
          html += `<td>${value}</td>`
        })

        html += `</tr>`
      })

      html += `</tbody>
    </table>`
    }

    html += `</body>
</html>`

    return html
  }

  static async exportToPSI(entries: FormEntry[], form: FormSchema): Promise<string> {
    const analysis = this.analyzeEntries(entries, form)

    let psi = `PSI Report - ${form.name}\n`
    psi += `Generated: ${new Date().toISOString()}\n`
    psi += `Total Entries: ${entries.length}\n\n`

    psi += `FORM STRUCTURE:\n`
    psi += `Name: ${form.name}\n`
    if (form.description) psi += `Description: ${form.description}\n`
    psi += `Fields: ${form.fields.length}\n\n`

    psi += `FIELD ANALYSIS:\n`
    form.fields.forEach((field) => {
      psi += `- ${field.label} (${field.type})\n`
      if (analysis.fieldStats[field.id]) {
        const stats = analysis.fieldStats[field.id]
        psi += `  Completion Rate: ${stats.completionRate}%\n`
        if (stats.uniqueValues) psi += `  Unique Values: ${stats.uniqueValues}\n`
        if (stats.mostCommon) psi += `  Most Common: ${stats.mostCommon}\n`
      }
    })

    psi += `\nSUMMARY:\n`
    psi += `Average Completion Rate: ${analysis.averageCompletionRate}%\n`
    psi += `Most Active Day: ${analysis.mostActiveDay}\n`
    psi += `Submission Trend: ${analysis.trend}\n`

    return psi
  }

  private static analyzeEntries(entries: FormEntry[], form: FormSchema) {
    const fieldStats: Record<string, any> = {}

    form.fields.forEach((field) => {
      const values = entries.map((entry) => entry.data[field.id]).filter((v) => v !== undefined && v !== "")
      const completionRate = Math.round((values.length / entries.length) * 100)

      fieldStats[field.id] = {
        completionRate,
        uniqueValues: new Set(values).size,
        mostCommon: this.getMostCommon(values),
      }
    })

    const averageCompletionRate = Math.round(
      Object.values(fieldStats).reduce((sum: number, stats: any) => sum + stats.completionRate, 0) / form.fields.length,
    )

    const dayStats = entries.reduce((acc: Record<string, number>, entry) => {
      const day = new Date(entry.createdAt).toDateString()
      acc[day] = (acc[day] || 0) + 1
      return acc
    }, {})

    const mostActiveDay = Object.entries(dayStats).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"

    return {
      fieldStats,
      averageCompletionRate,
      mostActiveDay,
      trend: entries.length > 1 ? "Increasing" : "Stable",
    }
  }

  private static getMostCommon(values: any[]): string {
    if (values.length === 0) return "N/A"

    const counts = values.reduce((acc: Record<string, number>, val) => {
      acc[val] = (acc[val] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"
  }
}
