
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { departments as initialDepartments } from "@/lib/data";
import { Briefcase, PlusCircle, Shield, Stethoscope, FileText, AlertTriangle, Cog, ListChecks, Wrench, FlaskConical, Truck, UserCheck, Edit, Trash, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ManageDepartmentDialog } from "./components/manage-department-dialog";
import { ManagePositionDialog } from "./components/manage-position-dialog";
import { useEffect, useState } from "react";
import type { Department, Position } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "use-debounce";
import { editPositionAction } from "./actions";

const departmentIcons: Record<string, React.ReactNode> = {
    'Production': <Cog className="h-5 w-5 text-primary" />,
    'Quality Assurance': <ListChecks className="h-5 w-5 text-primary" />,
    'Maintenance': <Wrench className="h-5 w-5 text-primary" />,
    'EHS': <Shield className="h-5 w-5 text-primary" />,
    'Engineering': <FlaskConical className="h-5 w-5 text-primary" />,
    'Supply Chain': <Truck className="h-5 w-5 text-primary" />,
    'Human Resources': <UserCheck className="h-5 w-5 text-primary" />
}

function InlineFrequencyInput({ departmentName, positionId, field, initialValue, onUpdate }: { departmentName: string, positionId: string, field: 'medicalExamFrequency' | 'fireProtectionExamFrequency', initialValue: number, onUpdate: () => void }) {
    const { toast } = useToast();
    const [value, setValue] = useState(initialValue);
    const [debouncedValue] = useDebounce(value, 1000);

    useEffect(() => {
        if (debouncedValue !== initialValue) {
            editPositionAction(departmentName, positionId, { [field]: debouncedValue })
                .then(result => {
                    if (result.success) {
                        toast({ title: "Success", description: "Frequency updated." });
                        onUpdate();
                    } else {
                        toast({ variant: "destructive", title: "Error", description: result.error });
                        setValue(initialValue); // Revert on error
                    }
                });
        }
    }, [debouncedValue, field, departmentName, positionId, initialValue, onUpdate, toast]);

    return (
        <Input
            type="number"
            step="0.1"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value))}
            className="h-8 w-20"
            onClick={(e) => e.stopPropagation()}
        />
    );
}

function PositionDetails({ department, position, onUpdate }: { department: Department, position: Position, onUpdate: () => void }) {
    const riskVariant = {
        'Low': 'secondary',
        'Medium': 'default',
        'High': 'destructive'
    }[position.riskLevel] as "secondary" | "default" | "destructive";

    return (
        <div className="pl-4 border-l-2 border-muted ml-4">
            <div className="space-y-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <p>{position.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-primary" />
                        <span>Medical Exam (Yrs):</span>
                        <InlineFrequencyInput departmentName={department.name} positionId={position.id} field="medicalExamFrequency" initialValue={position.medicalExamFrequency} onUpdate={onUpdate} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>Fire Protection (Yrs):</span>
                        <InlineFrequencyInput departmentName={department.name} positionId={position.id} field="fireProtectionExamFrequency" initialValue={position.fireProtectionExamFrequency} onUpdate={onUpdate} />
                    </div>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-primary" />
                        <span>Risk Level: <Badge variant={riskVariant}>{position.riskLevel}</Badge></span>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Risks and Measures</h4>
                    <div className="border rounded-md">
                        {position.risksAndMeasures.map((rm, index) => (
                             <div key={rm.id} className={`grid grid-cols-2 gap-x-4 p-2 ${index < position.risksAndMeasures.length - 1 ? 'border-b' : ''}`}>
                                <div>{rm.risk}</div>
                                <div className="text-muted-foreground border-l pl-4">{rm.measure}</div>
                            </div>
                        ))}
                         {position.risksAndMeasures.length === 0 && <p className="p-2 text-muted-foreground">No specific risks defined.</p>}
                    </div>
                </div>
                {position.specialConditions && (
                    <div>
                        <h4 className="font-semibold mb-1">Special Conditions</h4>
                        <p className="text-muted-foreground">{position.specialConditions}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function PositionItem({ department, position, onUpdate }: { department: Department, position: Position, onUpdate: () => void }) {
    const hasSubPositions = position.subPositions && position.subPositions.length > 0;
    
    return (
        <Accordion type="single" collapsible className="w-full pl-8">
            <AccordionItem value={position.id} key={position.id} className="border-b-0">
                <div className="flex items-center w-full group/position">
                    <AccordionTrigger className="flex-1 py-3 hover:no-underline">
                        <div className="flex items-center gap-3">
                            <Briefcase className="h-4 w-4" />
                            <span>{position.name}</span>
                        </div>
                    </AccordionTrigger>
                    <div className="flex items-center gap-1 pr-4 opacity-0 group-hover/position:opacity-100 transition-opacity">
                        <ManagePositionDialog department={department} position={position} onUpdate={onUpdate} triggerMode="edit">
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-4 w-4" /></Button>
                        </ManagePositionDialog>
                    </div>
                </div>
                <AccordionContent>
                    <PositionDetails department={department} position={position} onUpdate={onUpdate} />
                    {hasSubPositions && (
                        <div className="mt-4 pl-4 border-l-2 border-dashed">
                             <h4 className="font-semibold mb-2 text-xs uppercase text-muted-foreground">Sub-positions</h4>
                            {position.subPositions!.map(subPos => (
                               <PositionItem key={subPos.id} department={department} position={subPos} onUpdate={onUpdate} />
                            ))}
                        </div>
                    )}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}


export default function OrganizationPage() {
  // In a real app, this would be fetched from a server
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [accordionKey, setAccordionKey] = useState(Date.now());

  const onUpdate = () => {
    // This is a mock refresh. In a real app, you'd refetch data.
    // For now, we rely on the actions modifying the imported array.
    setDepartments([...initialDepartments]);
    // Force re-render of accordion to reflect changes, especially deletions
    setAccordionKey(Date.now());
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Organizational Structure</CardTitle>
          <CardDescription>
            An overview of all departments and the positions within them.
          </CardDescription>
        </div>
        <ManageDepartmentDialog onUpdate={onUpdate}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </ManageDepartmentDialog>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" key={accordionKey}>
          {departments.map((department) => (
            <AccordionItem value={department.name} key={department.name}>
                <div className="flex items-center w-full group/trigger">
                    <AccordionTrigger className="flex-1">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                {departmentIcons[department.name] || <Briefcase className="h-5 w-5 text-primary" />}
                            </div>
                            <span className="font-semibold text-lg">{department.name}</span>
                        </div>
                    </AccordionTrigger>
                    <div className="flex items-center gap-2 pr-4 opacity-0 group-hover/trigger:opacity-100 transition-opacity">
                        <ManageDepartmentDialog department={department} onUpdate={onUpdate}>
                            <Button variant="ghost" size="sm">Edit</Button>
                        </ManageDepartmentDialog>
                        <ManagePositionDialog department={department} onUpdate={onUpdate} triggerMode="add">
                            <Button variant="ghost" size="sm">Add Position</Button>
                        </ManagePositionDialog>
                    </div>
                </div>
              <AccordionContent>
                  {department.positions.length > 0 ? department.positions.map((position) => (
                    <PositionItem key={position.id} department={department} position={position} onUpdate={onUpdate} />
                  )) : <div className="text-sm text-muted-foreground pl-8 pt-2 pb-4 flex items-center gap-4">
                        <p>No positions defined for this department.</p>
                        <ManagePositionDialog department={department} onUpdate={onUpdate} triggerMode="add">
                            <Button variant="outline" size="sm">Add a Position</Button>
                        </ManagePositionDialog>
                      </div>
                  }
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

    
