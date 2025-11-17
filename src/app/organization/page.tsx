"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { departments as initialDepartments } from "@/lib/data";
import { Building2, Briefcase, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ManageDepartmentDialog } from "./components/manage-department-dialog";
import { ManagePositionDialog } from "./components/manage-position-dialog";
import { useState } from "react";
import type { Department } from "@/lib/types";

export default function OrganizationPage() {
  // In a real app, this would be fetched from a server
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [open, setOpen] = useState(true); // Keep accordion open after re-render

  const onDepartmentUpdate = () => {
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
        <ManageDepartmentDialog onUpdate={onDepartmentUpdate}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </ManageDepartmentDialog>
      </CardHeader>
      <CardContent>
        {open && <Accordion type="single" collapsible className="w-full">
          {departments.map((department) => (
            <AccordionItem value={department.name} key={department.name}>
              <AccordionTrigger>
                <div className="flex flex-1 items-center justify-between pr-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-lg">{department.name}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover/trigger:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <ManageDepartmentDialog department={department} onUpdate={onDepartmentUpdate}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </ManageDepartmentDialog>
                     <ManagePositionDialog department={department} onUpdate={onDepartmentUpdate}>
                       <Button variant="ghost" size="sm">Add Position</Button>
                    </ManagePositionDialog>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 pt-2 pl-8">
                  {department.positions.length > 0 ? department.positions.map((position) => (
                    <li key={position} className="flex items-center justify-between gap-3 text-sm text-muted-foreground group/position">
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-4 w-4" />
                        <span>{position}</span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover/position:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                          <ManagePositionDialog department={department} position={position} onUpdate={onDepartmentUpdate}>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Briefcase className="h-4 w-4" /></Button>
                          </ManagePositionDialog>
                      </div>
                    </li>
                  )) : <p className="text-sm text-muted-foreground">No positions defined for this department.</p>}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>}
      </CardContent>
    </Card>
  );
}
