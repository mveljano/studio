import { notFound } from "next/navigation";
import Image from "next/image";
import { getEmployee, getTrainingsForEmployee, getIncidentsForEmployee } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
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
  List,
  Mail,
  MoreVertical,
  Phone,
  PlayCircle,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import { TrainingModule } from "@/lib/types";
import { differenceInDays, parseISO } from "date-fns";
import RemediationDialog from "./components/remediation-dialog";

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
  const avatar = PlaceHolderImages.find((p) => p.id === employee.avatar);
  const today = new Date();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader className="flex flex-col items-center text-center">
            <Image
              src={avatar?.imageUrl || `https://picsum.photos/seed/${employee.id}/128/128`}
              alt={employee.name}
              width={128}
              height={128}
              className="rounded-full mb-4 border-4 border-card"
              data-ai-hint={avatar?.imageHint}
            />
            <CardTitle className="text-2xl">{employee.name}</CardTitle>
            <CardDescription>{employee.jobRole}</CardDescription>
            <Badge className="mt-2">{employee.status}</Badge>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <div className="flex items-center gap-3 mb-2">
              <User className="h-4 w-4" /> <span>{employee.department}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4" /> <span>{employee.email}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              <span>Certifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {employee.certifications.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {employee.certifications.map((cert) => (
                  <li key={cert} className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>{cert}</span>
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
          <CardHeader>
            <CardTitle>Assigned Trainings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Training</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainings.map((training) => {
                  const isActionable = training.status === "Overdue" || training.status === "In Progress";
                  const daysDelayed = training.status === "Overdue" ? differenceInDays(today, parseISO(training.dueDate)) : 0;

                  return (
                    <TableRow key={training.id}>
                      <TableCell className="font-medium">{training.name}</TableCell>
                      <TableCell>{training.dueDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(training.status)}
                          <span>{training.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {isActionable ? (
                          <RemediationDialog 
                            employeeName={employee.name}
                            trainingName={training.name}
                            daysDelayed={daysDelayed}
                            completionStatus={training.status}
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">No action needed</span>
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
          <CardHeader>
            <CardTitle>Safety Record</CardTitle>
          </CardHeader>
          <CardContent>
          {incidents.length > 0 ? (
            <ul className="space-y-4">
              {incidents.map((incident) => (
                <li key={incident.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Badge variant={incident.type === 'Injury' ? 'destructive' : 'secondary'}>{incident.type}</Badge>
                  </div>
                  <div>
                    <p className="font-medium">{incident.date}</p>
                    <p className="text-sm text-muted-foreground">{incident.description}</p>
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
