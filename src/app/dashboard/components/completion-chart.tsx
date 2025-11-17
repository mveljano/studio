"use client"

import { Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { trainingModules } from "@/lib/data"
import { TrainingStatus } from "@/lib/types"

const chartConfig = {
  Completed: { label: "Completed", color: "hsl(var(--chart-1))" },
  "In Progress": { label: "In Progress", color: "hsl(var(--chart-2))" },
  Overdue: { label: "Overdue", color: "hsl(var(--destructive))" },
  "Not Started": { label: "Not Started", color: "hsl(var(--muted))" },
} satisfies ChartConfig

export function TrainingCompletionChart() {
  const statusCounts = trainingModules.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {} as Record<TrainingStatus, number>);

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    fill: `var(--color-${status.replace(" ", "")})`
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
        <Pie data={chartData} dataKey="count" nameKey="status" innerRadius={60} />
        <ChartLegend
            content={<ChartLegendContent nameKey="status" />}
            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
          />
      </PieChart>
    </ChartContainer>
  )
}
