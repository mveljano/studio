
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash2, X } from "lucide-react";
import { addPositionAction, editPositionAction, removePositionAction } from "../actions";
import { getAllPositions } from "@/lib/data";
import type { Department, Position, RiskAndMeasure } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const riskAndMeasureSchema = z.object({
    id: z.string().optional(),
    risk: z.string().min(1, "Risk cannot be empty."),
    measure: z.string().min(1, "Measure cannot be empty."),
});

const formSchema = z.object({
  name: z.string().min(2, "Position name must be at least 2 characters."),
  description: z.string().min(1, "Description is required."),
  medicalExamFrequency: z.coerce.number().min(0, "Frequency must be 0 or greater."),
  fireProtectionExamFrequency: z.coerce.number().min(0, "Frequency must be 0 or greater."),
  riskLevel: z.enum(['Low', 'Medium', 'High']),
  specialConditions: z.string().optional(),
  parentId: z.string().nullable().optional(),
  risksAndMeasures: z.array(riskAndMeasureSchema),
});

type ManagePositionDialogProps = {
  department: Department;
  position?: Position;
  onUpdate: () => void;
  children: React.ReactNode;
  triggerMode?: 'edit' | 'add';
};

export function ManagePositionDialog({ department, position, onUpdate, children, triggerMode = 'add' }: ManagePositionDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEditing = triggerMode === 'edit' && !!position;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing ? {
      ...position,
      parentId: null, // This would need logic to find parent if we allow moving
      risksAndMeasures: position.risksAndMeasures || [],
    } : {
      name: "",
      description: "",
      medicalExamFrequency: 0,
      fireProtectionExamFrequency: 0,
      riskLevel: 'Low',
      specialConditions: "",
      parentId: null,
      risksAndMeasures: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "risksAndMeasures"
  });

  const availableParents = getAllPositions(department.name).filter(p => p.id !== position?.id);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const positionData: Omit<Position, 'id' | 'subPositions'> = {
        name: values.name,
        description: values.description,
        medicalExamFrequency: values.medicalExamFrequency,
        fireProtectionExamFrequency: values.fireProtectionExamFrequency,
        riskLevel: values.riskLevel,
        specialConditions: values.specialConditions || "",
        risksAndMeasures: values.risksAndMeasures.map(rm => ({...rm, id: rm.id || `rm-${Date.now()}-${Math.random()}`})),
    };
    
    const result = isEditing
      ? await editPositionAction(department.name, position.id, positionData)
      : await addPositionAction(department.name, positionData, values.parentId);

    if (result.success) {
      toast({
        title: "Success!",
        description: `Position has been ${isEditing ? 'updated' : 'added'}.`,
      });
      onUpdate();
      setOpen(false);
      form.reset(isEditing ? { ...values } : undefined);
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: result.error || "Could not save the position.",
      });
    }
    setLoading(false);
  }

  async function onDelete() {
    if (!position) return;
    setLoading(true);
    const result = await removePositionAction(department.name, position.id);
    if (result.success) {
        toast({
          title: "Success!",
          description: `Position "${position.name}" has been removed.`,
        });
        onUpdate();
        setOpen(false);
      } else {
          toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: result.error || "Could not remove position.",
          });
      }
      setLoading(false);
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
        // Reset form to its initial state when closing
        form.reset(isEditing ? {
            ...position,
            parentId: null,
            risksAndMeasures: position.risksAndMeasures || [],
          } : {
            name: "", description: "", medicalExamFrequency: 0, fireProtectionExamFrequency: 0, riskLevel: 'Low', specialConditions: "", parentId: null, risksAndMeasures: [],
        });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "Add"} Position</DialogTitle>
          <DialogDescription>
            {isEditing ? `Manage the details for the "${position.name}" position.` : `Add a new position to the ${department.name} department.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Position Name</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {!isEditing && (
                    <FormField
                        control={form.control}
                        name="parentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Parent Position (optional)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Top-level in department" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="">Top-level in department</SelectItem>
                                        {availableParents.map(p => (
                                            <SelectItem key={p.id} value={p.id} style={{ paddingLeft: `${p.level * 1.5 + 1}rem` }}>
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem> <FormLabel>Description</FormLabel> <FormControl> <Textarea {...field} /> </FormControl> <FormMessage /> </FormItem>
                )}/>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="medicalExamFrequency" render={({ field }) => (
                        <FormItem> <FormLabel>Medical Exam Frequency (Yrs)</FormLabel> <FormControl> <Input type="number" step="0.1" {...field} /> </FormControl> <FormMessage /> </FormItem>
                    )}/>
                    <FormField control={form.control} name="fireProtectionExamFrequency" render={({ field }) => (
                        <FormItem> <FormLabel>Fire Protection Frequency (Yrs)</FormLabel> <FormControl> <Input type="number" step="0.1" {...field} /> </FormControl> <FormMessage /> </FormItem>
                    )}/>
                    <FormField control={form.control} name="riskLevel" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Risk Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>

                <FormField control={form.control} name="specialConditions" render={({ field }) => (
                    <FormItem> <FormLabel>Special Conditions</FormLabel> <FormControl> <Textarea {...field} /> </FormControl> <FormMessage /> </FormItem>
                )}/>

                <div>
                    <FormLabel>Risks and Measures</FormLabel>
                    <div className="mt-2 space-y-2">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 items-start">
                                <FormField
                                    control={form.control}
                                    name={`risksAndMeasures.${index}.risk`}
                                    render={({ field }) => <Input placeholder="Risk description" {...field} className="h-9" />}
                                />
                                <FormField
                                    control={form.control}
                                    name={`risksAndMeasures.${index}.measure`}
                                    render={({ field }) => <Input placeholder="Preventative measure" {...field} className="h-9" />}
                                />
                                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => remove(index)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                         <Button type="button" variant="outline" size="sm" onClick={() => append({ id: `new-${Date.now()}`, risk: "", measure: "" })}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Risk
                        </Button>
                    </div>
                </div>
            </div>
            <DialogFooter className="pt-4">
                {isEditing && (
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button type="button" variant="destructive" className="mr-auto" disabled={loading}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the <strong>{position.name}</strong> position.
                                You can only delete positions that have no employees and no sub-positions assigned to them.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Continue
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                <DialogClose asChild>
                    <Button type="button" variant="ghost" disabled={loading}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
