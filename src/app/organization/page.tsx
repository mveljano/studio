

"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { departments as initialDepartments } from "@/lib/data";
import { Briefcase, PlusCircle, Shield, Stethoscope, FileText, AlertTriangle, Cog, ListChecks, Wrench, FlaskConical, Truck, UserCheck, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ManageDepartmentDialog } from "./components/manage-department-dialog";
import { useEffect, useState } from "react";
import type { Department, Position } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import { addPositionAction, editPositionAction, removePositionAction } from "./actions";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";


const departmentIcons: Record<string, React.ReactNode> = {
    'Production': <Cog className="h-5 w-5 text-primary" />,
    'Quality Assurance': <ListChecks className="h-5 w-5 text-primary" />,
    'Maintenance': <Wrench className="h-5 w-5 text-primary" />,
    'EHS': <Shield className="h-5 w-5 text-primary" />,
    'Engineering': <FlaskConical className="h-5 w-5 text-primary" />,
    'Supply Chain': <Truck className="h-5 w-5 text-primary" />,
    'Human Resources': <UserCheck className="h-5 w-5 text-primary" />
}

// --- Inline Editable Components ---

function InlineInput({ departmentName, positionId, field, initialValue, onUpdate, className, placeholder }: { departmentName: string, positionId: string, field: keyof Position, initialValue: string, onUpdate: () => void, className?: string, placeholder?: string }) {
    const { toast } = useToast();
    const [value, setValue] = useState(initialValue);

    const debounced = useDebouncedCallback((newValue) => {
        if (newValue !== initialValue) {
            editPositionAction(departmentName, positionId, { [field]: newValue })
                .then(result => {
                    if (result.success) {
                        toast({ title: "Success", description: "Position updated." });
                        onUpdate();
                    } else {
                        toast({ variant: "destructive", title: "Error", description: result.error });
                        setValue(initialValue); // Revert on error
                    }
                });
        }
    }, 1000);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return (
        <Input
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
                debounced(e.target.value);
            }}
            className={cn("h-8", className)}
            onClick={(e) => e.stopPropagation()}
            placeholder={placeholder}
        />
    );
}

function InlineTextarea({ departmentName, positionId, field, initialValue, onUpdate, placeholder }: { departmentName: string, positionId: string, field: keyof Position, initialValue: string, onUpdate: () => void, placeholder?: string }) {
    const { toast } = useToast();
    const [value, setValue] = useState(initialValue);

    const debounced = useDebouncedCallback((newValue) => {
        if (newValue !== initialValue) {
            editPositionAction(departmentName, positionId, { [field]: newValue })
                .then(result => {
                    if (result.success) {
                        toast({ title: "Success", description: "Position updated." });
                        onUpdate();
                    } else {
                        toast({ variant: "destructive", title: "Error", description: result.error });
                        setValue(initialValue); // Revert on error
                    }
                });
        }
    }, 1000);
    
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);


    return (
        <Textarea
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
                debounced(e.target.value);
            }}
            className="text-sm"
            onClick={(e) => e.stopPropagation()}
            placeholder={placeholder}
        />
    );
}


function InlineSelect({ departmentName, positionId, initialValue, onUpdate }: { departmentName: string, positionId: string, initialValue: Position['riskLevel'], onUpdate: () => void }) {
    const { toast } = useToast();
    const [value, setValue] = useState(initialValue);

    const handleValueChange = (newValue: Position['riskLevel']) => {
        setValue(newValue);
        editPositionAction(departmentName, positionId, { riskLevel: newValue })
            .then(result => {
                if (result.success) {
                    toast({ title: "Success", description: "Risk level updated." });
                    onUpdate();
                } else {
                    toast({ variant: "destructive", title: "Error", description: result.error });
                    setValue(initialValue); // Revert
                }
            });
    }
    
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return (
        <Select value={value} onValueChange={handleValueChange}>
            <SelectTrigger className="h-8 w-32" onClick={(e) => e.stopPropagation()}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent onClick={(e) => e.stopPropagation()}>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
            </SelectContent>
        </Select>
    );
}


function InlineFrequencyInput({ departmentName, positionId, field, initialValue, onUpdate }: { departmentName: string, positionId: string, field: 'medicalExamFrequency' | 'fireProtectionExamFrequency', initialValue: number, onUpdate: () => void }) {
    const { toast } = useToast();
    const [value, setValue] = useState(initialValue);

    const debounced = useDebouncedCallback((newValue) => {
        if (newValue !== initialValue) {
            editPositionAction(departmentName, positionId, { [field]: newValue })
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
    }, 1000);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return (
        <Input
            type="number"
            step="0.1"
            value={value}
            onChange={(e) => {
                const num = parseFloat(e.target.value);
                setValue(isNaN(num) ? 0 : num);
                debounced(isNaN(num) ? 0 : num);
            }}
            className="h-8 w-20"
            onClick={(e) => e.stopPropagation()}
        />
    );
}

// --- Risks and Measures ---

function RisksAndMeasuresManager({ department, position, onUpdate }: { department: Department, position: Position, onUpdate: () => void }) {
    const { toast } = useToast();
    const [risks, setRisks] = useState(position.risksAndMeasures || []);

    const handleUpdate = (index: number, field: 'risk' | 'measure', value: string) => {
        const newRisks = [...risks];
        newRisks[index] = { ...newRisks[index], [field]: value };
        setRisks(newRisks);
    };

    const debouncedSave = useDebouncedCallback((newRisks) => {
        editPositionAction(department.name, position.id, { risksAndMeasures: newRisks }).then(result => {
            if (result.success) {
                toast({ title: "Success", description: "Risks & Measures updated." });
                onUpdate();
            } else {
                toast({ variant: "destructive", title: "Error", description: result.error });
                setRisks(position.risksAndMeasures || []); // Revert
            }
        });
    }, 1500);

    const handleAddRisk = () => {
        const newRisk = { id: `new-${Date.now()}`, risk: "", measure: "" };
        const newRisks = [...risks, newRisk];
        setRisks(newRisks);
        debouncedSave(newRisks);
    };

    const handleRemoveRisk = (index: number) => {
        const newRisks = risks.filter((_, i) => i !== index);
        setRisks(newRisks);
        debouncedSave(newRisks);
    };

    useEffect(() => {
       setRisks(position.risksAndMeasures || []);
    }, [position.risksAndMeasures]);

    return (
        <div>
            <h4 className="font-semibold mb-2">Risks and Measures</h4>
            <div className="border rounded-md text-sm">
                <div className="grid grid-cols-2 gap-x-4 p-2 font-medium bg-muted/50 border-b">
                    <div>Risk</div>
                    <div className="border-l pl-4">Preventative Measure</div>
                </div>
                {(risks || []).map((rm, index) => (
                    <div key={rm.id} className={`grid grid-cols-2 gap-x-4 p-1 items-center ${index < risks.length - 1 ? 'border-b' : ''}`}>
                        <Input
                            value={rm.risk}
                            onChange={e => { handleUpdate(index, 'risk', e.target.value); debouncedSave([...risks]); }}
                            placeholder="Risk description"
                            className="h-8 border-0 shadow-none focus-visible:ring-1"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex items-center gap-1">
                            <Input
                                value={rm.measure}
                                onChange={e => { handleUpdate(index, 'measure', e.target.value); debouncedSave([...risks]); }}
                                placeholder="Measure description"
                                className="h-8 border-0 shadow-none focus-visible:ring-1 flex-grow"
                                onClick={(e) => e.stopPropagation()}
                            />
                             <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveRisk(index)} aria-label="Remove risk">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                 {risks.length === 0 && <p className="p-2 text-muted-foreground">No specific risks defined.</p>}
                 <div className="p-1">
                    <Button type="button" variant="ghost" size="sm" onClick={handleAddRisk} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Risk
                    </Button>
                 </div>
            </div>
        </div>
    );
}

// --- Position Components ---

function AddPosition({ departmentName, parentId, onUpdate }: { departmentName: string, parentId: string | null, onUpdate: () => void }) {
    const { toast } = useToast();
    const [name, setName] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = async () => {
        if (!name.trim()) {
            toast({ variant: "destructive", title: "Error", description: "Position name cannot be empty." });
            return;
        }
        
        const result = await addPositionAction(departmentName, {
            name: name,
            description: "",
            medicalExamFrequency: 0,
            fireProtectionExamFrequency: 0,
            riskLevel: 'Low',
            specialConditions: "",
            risksAndMeasures: [],
        }, parentId);

        if (result.success) {
            toast({ title: "Success", description: "Position added." });
            onUpdate();
            setName("");
            setIsAdding(false);
        } else {
            toast({ variant: "destructive", title: "Error", description: result.error });
        }
    };
    
    if (!isAdding) {
        return (
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setIsAdding(true); }} className="w-full justify-start gap-2 text-muted-foreground">
                <PlusCircle className="h-4 w-4" /> Add a position
            </Button>
        )
    }

    return (
        <div className="flex gap-2 p-1" onClick={e => e.stopPropagation()}>
            <Input 
                placeholder="New position name..." 
                value={name}
                onChange={e => setName(e.target.value)}
                className="h-8"
                autoFocus
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <Button size="sm" onClick={handleAdd}>Add</Button>
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
        </div>
    )
}

function PositionDetails({ department, position, onUpdate }: { department: Department, position: Position, onUpdate: () => void }) {
    return (
        <div className="pl-4 border-l-2 border-muted ml-4 space-y-4 text-sm" onClick={e => e.stopPropagation()}>
            <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <InlineTextarea departmentName={department.name} positionId={position.id} field="description" initialValue={position.description} onUpdate={onUpdate} placeholder="Enter position description..." />
            </div>
           
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground">Medical Exam (Yrs)</label>
                    <InlineFrequencyInput departmentName={department.name} positionId={position.id} field="medicalExamFrequency" initialValue={position.medicalExamFrequency} onUpdate={onUpdate} />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground">Fire Protection (Yrs)</label>
                    <InlineFrequencyInput departmentName={department.name} positionId={position.id} field="fireProtectionExamFrequency" initialValue={position.fireProtectionExamFrequency} onUpdate={onUpdate} />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground">Risk Level</label>
                    <InlineSelect departmentName={department.name} positionId={position.id} initialValue={position.riskLevel} onUpdate={onUpdate} />
                </div>
            </div>
            
            <RisksAndMeasuresManager department={department} position={position} onUpdate={onUpdate} />

            <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Special Conditions</label>
                <InlineTextarea departmentName={department.name} positionId={position.id} field="specialConditions" initialValue={position.specialConditions} onUpdate={onUpdate} placeholder="Enter special conditions..."/>
            </div>
        </div>
    );
}

function PositionItem({ department, position, onUpdate }: { department: Department, position: Position, onUpdate: () => void }) {
    const hasSubPositions = position.subPositions && position.subPositions.length > 0;
    const { toast } = useToast();

    const handleDelete = async () => {
        const result = await removePositionAction(department.name, position.id);
        if (result.success) {
            toast({ title: "Success", description: "Position removed." });
            onUpdate();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.error });
        }
    }
    
    return (
        <Accordion type="single" collapsible className="w-full pl-8" onClick={e => e.stopPropagation()}>
            <AccordionItem value={position.id} key={position.id} className="border-b-0">
                <div className="flex items-center w-full group/position">
                    <AccordionTrigger className="flex-1 py-1 hover:no-underline -ml-8 pl-8">
                        <div className="flex items-center gap-3">
                            <Briefcase className="h-4 w-4" />
                            <InlineInput 
                                departmentName={department.name} 
                                positionId={position.id} 
                                field="name" 
                                initialValue={position.name} 
                                onUpdate={onUpdate}
                                className="h-8 border-0 shadow-none focus-visible:ring-1 font-semibold"
                            />
                        </div>
                    </AccordionTrigger>
                    <div className="flex items-center gap-1 pr-4 opacity-0 group-hover/position:opacity-100 transition-opacity">
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={(e) => e.stopPropagation()} aria-label={`Delete position ${position.name}`}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the <strong>{position.name}</strong> position. You can only delete positions that have no employees and no sub-positions assigned.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                                    Continue
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
                <AccordionContent>
                    <PositionDetails department={department} position={position} onUpdate={onUpdate} />
                    <div className="mt-4 pl-4 border-l-2 border-dashed">
                        <h4 className="font-semibold mb-2 text-xs uppercase text-muted-foreground ml-4">Sub-positions</h4>
                        {hasSubPositions && position.subPositions!.map(subPos => (
                            <PositionItem key={subPos.id} department={department} position={subPos} onUpdate={onUpdate} />
                        ))}
                        <div className="pl-8">
                            <AddPosition departmentName={department.name} parentId={position.id} onUpdate={onUpdate} />
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

// --- Main Page Component ---

export default function OrganizationPage() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [accordionKey, setAccordionKey] = useState(Date.now());

  const onUpdate = () => {
    // This is a mock refresh. In a real app, you'd refetch data.
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
                    </div>
                </div>
              <AccordionContent>
                  {department.positions.length > 0 ? department.positions.map((position) => (
                    <PositionItem key={position.id} department={department} position={position} onUpdate={onUpdate} />
                  )) : null }
                   <div className="pl-8 pt-2 pb-4 flex items-center gap-4">
                        <AddPosition departmentName={department.name} parentId={null} onUpdate={onUpdate} />
                   </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
