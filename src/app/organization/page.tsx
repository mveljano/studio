
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
import { Building2, Briefcase, PlusCircle, ChevronsRight, Shield, Stethoscope, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ManageDepartmentDialog } from "./components/manage-department-dialog";
import { ManagePositionDialog } from "./components/manage-position-dialog";
import { useState } from "react";
import type { Department, Position } from "@/lib/types";

function PositionDetails({ position }: { position: Position }) {
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
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-primary" />
                        <span>Medical Exam: Every <strong>{position.medicalExamFrequency}</strong> years</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>Fire Protection: Every <strong>{position.fireProtectionExamFrequency}</strong> years</span>
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
            {/* TODO: Add edit/delete for position details */}
        </div>
    );
}

function PositionItem({ department, position, onUpdate }: { department: Department, position: Position, onUpdate: () => void }) {
    const hasSubPositions = position.subPositions && position.subPositions.length > 0;
    
    return (
        <Accordion type="single" collapsible className="w-full pl-8">
            <AccordionItem value={position.id} key={position.id} className="border-b-0">
                <div className="flex items-center w-full group/position">
                    <AccordionTrigger className="flex-1 py-3">
                        <div className="flex items-center gap-3">
                            <Briefcase className="h-4 w-4" />
                            <span>{position.name}</span>
                        </div>
                    </AccordionTrigger>
                    <div className="flex items-center gap-2 pr-4 opacity-0 group-hover/position:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        {/* <ManagePositionDialog department={department} position={position} onUpdate={onUpdate}>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Briefcase className="h-4 w-4" /></Button>
                        </ManagePositionDialog> */}
                    </div>
                </div>
                <AccordionContent>
                    <PositionDetails position={position} />
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
  const [open, setOpen] = useState(true); // Keep accordion open after re-render

  const onUpdate = () => {
    // This is a mock refresh. In a real app, you'd refetch data.
    // For now, we rely on the actions modifying the imported array.
    setDepartments([...initialDepartments]);
    setOpen(false);
    setTimeout(() => setOpen(true), 0);
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
        {open && <Accordion type="single" collapsible className="w-full">
          {departments.map((department) => (
            <AccordionItem value={department.name} key={department.name} className="group/trigger">
              <div className="flex items-center w-full">
                <AccordionTrigger className="flex-1">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-lg">{department.name}</span>
                  </div>
                </AccordionTrigger>
                <div className="flex items-center gap-2 pr-4 opacity-0 group-hover/trigger:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <ManageDepartmentDialog department={department} onUpdate={onUpdate}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </ManageDepartmentDialog>
                      <ManagePositionDialog department={department} onUpdate={onUpdate}>
                        <Button variant="ghost" size="sm">Add Position</Button>
                    </ManagePositionDialog>
                  </div>
              </div>
              <AccordionContent>
                  {department.positions.length > 0 ? department.positions.map((position) => (
                    <PositionItem key={position.id} department={department} position={position} onUpdate={onUpdate} />
                  )) : <p className="text-sm text-muted-foreground pl-8 pt-2">No positions defined for this department.</p>}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>}
      </CardContent>
    </Card>
  );
}
