import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { ExportService } from "@/lib/export-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formId, format } = body

    if (!formId || !format) {
      return NextResponse.json({ error: "Missing formId or format" }, { status: 400 })
    }

    const [form, entries] = await Promise.all([db.getForm(formId), db.getEntries(formId)])

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    let content: string | ArrayBuffer
    let mimeType: string

    switch (format) {
      case "csv":
        content = await ExportService.exportToCSV(entries, form)
        mimeType = "text/csv"
        break
      case "xlsx":
        content = await ExportService.exportToExcel(entries, form)
        mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        break
      case "pdf":
        content = await ExportService.exportToPDF(entries, form)
        mimeType = "application/pdf"
        break
      case "json":
        content = await ExportService.exportToJSON(entries, form)
        mimeType = "application/json"
        break
      case "xml":
        content = await ExportService.exportToXML(entries, form)
        mimeType = "application/xml"
        break
      case "yaml":
      case "yml":
        content = await ExportService.exportToYAML(entries, form)
        mimeType = "text/yaml"
        break
      case "html":
        content = await ExportService.exportToHTML(entries, form)
        mimeType = "text/html"
        break
      case "psi":
        content = await ExportService.exportToPSI(entries, form)
        mimeType = "text/plain"
        break
      default:
        return NextResponse.json({ error: "Unsupported format" }, { status: 400 })
    }

    return new NextResponse(content, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${form.name}.${format}"`,
      },
    })
  } catch (error) {
    console.error("Error exporting data:", error)
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}
