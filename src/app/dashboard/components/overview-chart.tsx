"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", completed: 186, overdue: 80 },
  { month: "February", completed: 305, overdue: 200 },
  { month: "March", completed: 237, overdue: 120 },
  { month: "April", completed: 73, overdue: 190 },
  { month: "May", completed: 209, overdue: 130 },
  { month: "June", completed: 214, overdue: 140 },
]

const chartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
  overdue: {
    label: "Overdue",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function TrainingOverviewChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
        <Bar dataKey="overdue" fill="var(--color-overdue)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
