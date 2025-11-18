import { notFound } from "next/navigation";
import Link from "next/link";
import { getEmployee, getTrainingsForEmployee, getIncidentsForEmployee } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  Clock,
  FileText,
  Mail,
  PlayCircle,
  ShieldCheck,
  User,
  XCircle,
  Briefcase,
  Home,
  Cake,
  Building,
  Contact,
  Calendar,
  CalendarX,
} from "lucide-react";
import { TrainingModule } from "@/lib/types";
import { differenceInDays, parseISO } from "date-fns";
import RemediationDialog from "./components/remediation-dialog";
import { Button } from "@/components/ui/button";

function getStatusIcon(status: TrainingModule['status']) {
  switch (status) {
    case "Completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "In Progress":
      return <PlayCircle className="h-4 w-4 text-blue-500" />;
    case "Overdue":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
}

export default function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const employee = getEmployee(params.id);
  if (!employee) {
    notFound();
  }

  const trainings = getTrainingsForEmployee(params.id);
  const incidents = getIncidentsForEmployee(params.id);
  const today = new Date();
  const fullName = `${employee.firstName} ${employee.lastName}`;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{fullName}</CardTitle>
            <CardDescription>{employee.position}</CardDescription>
            <Badge className="mt-2 mx-auto">{employee.status}</Badge>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-3">
              <Contact className="h-4 w-4" /> <span>{employee.employeeId}</span>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-4 w-4" /> <span>{employee.gender}</span>
            </div>
            <div className="flex items-center gap-3">
              <Cake className="h-4 w-4" /> <span>{employee.dateOfBirth}</span>
            </div>
             <div className="flex items-center gap-3">
              <Briefcase className="h-4 w-4" /> <span>{employee.profession}</span>
            </div>
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4" /> <span>{employee.department}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4" /> <span>{employee.email}</span>
            </div>
             <div className="flex items-center gap-3">
              <Home className="h-4 w-4" /> <span>{employee.residence}, {employee.municipality}</span>
            </div>
             <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4" /> <span>Employed: {employee.employmentDate}</span>
            </div>
            {employee.terminationDate && (
              <div className="flex items-center gap-3 text-destructive">
                <CalendarX className="h-4 w-4" /> <span>Terminated: {employee.terminationDate}</span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Certifications</span>
                </CardTitle>
            </div>
            <Button size="sm" variant="outline">Add</Button>
          </CardHeader>
          <CardContent>
            {employee.certifications.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {employee.certifications.map((cert) => (
                  <li key={cert} className="flex items-center justify-between gap-2 group">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>{cert}</span>
                    </div>
                     <div className="opacity-0 group-hover:opacity-100 space-x-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" aria-label={`View certification for ${cert}`}><FileText className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" aria-label={`Remove certification for ${cert}`}><XCircle className="h-4 w-4" /></Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No certifications on record.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Assigned Trainings</CardTitle>
            <Button size="sm" variant="outline">Add</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Training</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainings.map((training) => {
                  const isActionable = training.status === "Overdue" || training.status === "In Progress";
                  const daysDelayed = training.status === "Overdue" ? differenceInDays(today, parseISO(training.dueDate)) : 0;
                  const dateToShow = training.status === 'Completed' ? training.completionDate : training.dueDate;

                  return (
                    <TableRow key={training.id}>
                      <TableCell className="font-medium">{training.name}</TableCell>
                      <TableCell>{dateToShow}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(training.status)}
                          <span>{training.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {isActionable && (
                          <RemediationDialog 
                            employeeName={fullName}
                            trainingName={training.name}
                            daysDelayed={daysDelayed}
                            completionStatus={training.status}
                          />
                        )}
                         {training.status === 'Not Started' && (
                           <Button variant="ghost" size="sm">View</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Safety Record</CardTitle>
            <Button size="sm" variant="outline">Add</Button>
          </CardHeader>
          <CardContent>
          {incidents.length > 0 ? (
            <ul className="space-y-4">
              {incidents.map((incident) => (
                <li key={incident.id} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 mt-1">
                    <Badge variant={incident.type === 'Injury' ? 'destructive' : 'secondary'}>{incident.type}</Badge>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{incident.date}</p>
                    <p className="text-sm text-muted-foreground">{incident.description}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 space-x-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" aria-label={`View details for incident on ${incident.date}`}><FileText className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" aria-label={`Remove incident on ${incident.date}`}><XCircle className="h-4 w-4" /></Button>
                  </div>
                </li>
              ))}
            </ul>
             ) : (
              <p className="text-sm text-muted-foreground">No safety incidents on record.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
