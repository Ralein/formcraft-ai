import type { FormSchema, FormEntry, GeneratedTemplate } from "./types"
import { v4 as uuidv4 } from "uuid"

// Simple JSON-based database for preview purposes
// In production, replace with actual database

class JSONDatabase {
  private forms: FormSchema[] = []
  private entries: FormEntry[] = []
  private templates: GeneratedTemplate[] = []

  constructor() {
    this.loadData()
  }

  private loadData() {
    if (typeof window !== "undefined") {
      const formsData = localStorage.getItem("formcraft-forms")
      const entriesData = localStorage.getItem("formcraft-entries")
      const templatesData = localStorage.getItem("formcraft-templates")

      if (formsData) this.forms = JSON.parse(formsData)
      if (entriesData) this.entries = JSON.parse(entriesData)
      if (templatesData) this.templates = JSON.parse(templatesData)
    }
  }

  private saveData() {
    if (typeof window !== "undefined") {
      localStorage.setItem("formcraft-forms", JSON.stringify(this.forms))
      localStorage.setItem("formcraft-entries", JSON.stringify(this.entries))
      localStorage.setItem("formcraft-templates", JSON.stringify(this.templates))
    }
  }

  // Forms
  async createForm(form: Omit<FormSchema, "id" | "createdAt" | "updatedAt">): Promise<FormSchema> {
    const newForm: FormSchema = {
      ...form,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.forms.push(newForm)
    this.saveData()
    return newForm
  }

  async getForms(): Promise<FormSchema[]> {
    return this.forms
  }

  async getForm(id: string): Promise<FormSchema | null> {
    return this.forms.find((form) => form.id === id) || null
  }

  async updateForm(id: string, updates: Partial<FormSchema>): Promise<FormSchema | null> {
    const index = this.forms.findIndex((form) => form.id === id)
    if (index === -1) return null

    this.forms[index] = {
      ...this.forms[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.saveData()
    return this.forms[index]
  }

  async deleteForm(id: string): Promise<boolean> {
    const index = this.forms.findIndex((form) => form.id === id)
    if (index === -1) return false

    this.forms.splice(index, 1)
    this.saveData()
    return true
  }

  // Entries
  async createEntry(entry: Omit<FormEntry, "id" | "createdAt">): Promise<FormEntry> {
    const newEntry: FormEntry = {
      ...entry,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    }
    this.entries.push(newEntry)
    this.saveData()
    return newEntry
  }

  async getEntries(formId: string): Promise<FormEntry[]> {
    return this.entries.filter((entry) => entry.formId === formId)
  }

  async getAllEntries(): Promise<FormEntry[]> {
    return this.entries
  }

  // Templates
  async createTemplate(template: Omit<GeneratedTemplate, "id" | "createdAt">): Promise<GeneratedTemplate> {
    const newTemplate: GeneratedTemplate = {
      ...template,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    }
    this.templates.push(newTemplate)
    this.saveData()
    return newTemplate
  }

  async getTemplates(formId: string): Promise<GeneratedTemplate[]> {
    return this.templates.filter((template) => template.formId === formId)
  }
}

export const db = new JSONDatabase()
