import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CheckCircle2, Clock, Users } from "lucide-react";
import { employees, safetyIncidents, trainingModules } from "@/lib/data";
import { TrainingOverviewChart } from "./components/overview-chart";
import { TrainingCompletionChart } from "./components/completion-chart";

export default function DashboardPage() {
  const totalEmployees = employees.length;
  const completedTrainings = trainingModules.filter(t => t.status === 'Completed').length;
  const totalTrainings = trainingModules.length;
  const compliancePercentage = totalTrainings > 0 ? Math.round((completedTrainings / totalTrainings) * 100) : 0;
  const overdueTrainings = trainingModules.filter(t => t.status === 'Overdue').length;
  const activeIncidents = safetyIncidents.filter(i => new Date(i.date) > new Date(new Date().setMonth(new Date().getMonth() - 3))).length;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active and on-leave employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Compliance</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{compliancePercentage}%</div>
            <p className="text-xs text-muted-foreground">Based on all assigned trainings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Trainings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{overdueTrainings}</div>
            <p className="text-xs text-muted-foreground">Trainings past their due date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{activeIncidents}</div>
            <p className="text-xs text-muted-foreground">Incidents in the last 90 days</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Training Overview</CardTitle>
            <CardDescription>Monthly training completion trends.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <TrainingOverviewChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Completion Status</CardTitle>
            <CardDescription>Breakdown of all assigned trainings.</CardDescription>
          </CardHeader>
          <CardContent>
            <TrainingCompletionChart />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Safety Incidents</CardTitle>
          <CardDescription>A log of recent safety-related incidents.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safetyIncidents.slice(0, 5).map((incident) => {
                const employee = employees.find(e => e.id === incident.employeeId);
                return (
                  <TableRow key={incident.id}>
                    <TableCell className="font-medium">{employee?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <Badge variant={incident.type === 'Injury' ? 'destructive' : 'secondary'}>
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        {incident.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{incident.date}</TableCell>
                    <TableCell className="max-w-sm truncate">{incident.description}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
