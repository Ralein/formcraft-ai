"use client"
import type { FormEntry, FormSchema } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { formatDate } from "@/lib/utils"

interface AnalyticsDashboardProps {
  form: FormSchema
  entries: FormEntry[]
}

export function AnalyticsDashboard({ form, entries }: AnalyticsDashboardProps) {
  // Calculate completion rates for each field
  const fieldCompletionData = form.fields.map((field) => {
    const completedCount = entries.filter((entry) => {
      const value = entry.data[field.id]
      return value !== undefined && value !== "" && value !== null
    }).length

    return {
      name: field.label,
      completed: completedCount,
      total: entries.length,
      rate: entries.length > 0 ? Math.round((completedCount / entries.length) * 100) : 0,
    }
  })

  // Calculate submissions over time
  const submissionsByDay = entries.reduce((acc: Record<string, number>, entry) => {
    const date = new Date(entry.createdAt).toDateString()
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const timelineData = Object.entries(submissionsByDay)
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString(),
      submissions: count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Calculate field type distribution
  const fieldTypeData = form.fields.reduce((acc: Record<string, number>, field) => {
    acc[field.type] = (acc[field.type] || 0) + 1
    return acc
  }, {})

  const fieldTypeChartData = Object.entries(fieldTypeData).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  // Calculate average completion rate
  const averageCompletionRate =
    fieldCompletionData.length > 0
      ? Math.round(fieldCompletionData.reduce((sum, field) => sum + field.rate, 0) / fieldCompletionData.length)
      : 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entries.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Form Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{form.fields.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageCompletionRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Submission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {entries.length > 0 ? formatDate(entries[entries.length - 1].createdAt).split(",")[0] : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Field Completion Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Field Completion Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fieldCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value, name) => [`${value}%`, "Completion Rate"]} />
                <Bar dataKey="rate" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Field Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Field Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fieldTypeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fieldTypeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Timeline */}
      {timelineData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Submissions Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="submissions" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Detailed Field Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Field Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fieldCompletionData.map((field, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{field.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {field.completed} of {field.total} completed
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{field.rate}%</div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${field.rate}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
