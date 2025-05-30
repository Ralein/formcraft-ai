export interface FormField {
  id: string
  type: "text" | "email" | "number" | "textarea" | "select" | "radio" | "checkbox" | "file" | "date"
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface FormSchema {
  id: string
  name: string
  description?: string
  fields: FormField[]
  createdAt: string
  updatedAt: string
}

export interface FormEntry {
  id: string
  formId: string
  data: Record<string, any>
  createdAt: string
}

export interface GeneratedTemplate {
  id: string
  formId: string
  name: string
  content: string
  format: string
  createdAt: string
}

export interface ExportFormat {
  value: string
  label: string
  extension: string
}

export const EXPORT_FORMATS: ExportFormat[] = [
  { value: "pdf", label: "PDF Document", extension: ".pdf" },
  { value: "docx", label: "Word Document", extension: ".docx" },
  { value: "odt", label: "OpenDocument Text", extension: ".odt" },
  { value: "txt", label: "Plain Text", extension: ".txt" },
  { value: "csv", label: "CSV Spreadsheet", extension: ".csv" },
  { value: "xlsx", label: "Excel Spreadsheet", extension: ".xlsx" },
  { value: "xls", label: "Excel Legacy", extension: ".xls" },
  { value: "json", label: "JSON Data", extension: ".json" },
  { value: "xml", label: "XML Document", extension: ".xml" },
  { value: "yaml", label: "YAML Document", extension: ".yaml" },
  { value: "yml", label: "YAML Document", extension: ".yml" },
  { value: "html", label: "HTML Document", extension: ".html" },
  { value: "log", label: "Log File", extension: ".log" },
  { value: "psi", label: "PSI Report", extension: ".psi" },
]
