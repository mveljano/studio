"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Loader2, Trash2 } from "lucide-react";
import { addDepartmentAction, editDepartmentAction, removeDepartmentAction } from "../actions";
import type { Department } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters."),
});

type ManageDepartmentDialogProps = {
  department?: Department;
  onUpdate: () => void;
  children: React.ReactNode;
};

export function ManageDepartmentDialog({ department, onUpdate, children }: ManageDepartmentDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: department?.name || "",
    },
  });

  const isEditing = !!department;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const result = isEditing
      ? await editDepartmentAction(department.name, values.name)
      : await addDepartmentAction(values.name);

    if (result.success) {
      toast({
        title: "Success!",
        description: `Department has been ${isEditing ? 'updated' : 'added'}.`,
      });
      onUpdate();
      setOpen(false);
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: result.error || "Could not save the department.",
      });
    }
    setLoading(false);
  }

  async function onDelete() {
    if (!department) return;
    setLoading(true);
    const result = await removeDepartmentAction(department.name);
    if (result.success) {
        toast({
          title: "Success!",
          description: `Department "${department.name}" has been removed.`,
        });
        onUpdate();
        setOpen(false);
      } else {
          toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: result.error || "Could not remove department.",
          });
      }
      setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "Add"} Department</DialogTitle>
          <DialogDescription>
            {isEditing ? "Rename the department." : "Add a new department to the organizational structure."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                {isEditing && (
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button type="button" variant="destructive" className="mr-auto">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the <strong>{department.name}</strong> department.
                                You can only delete departments that have no employees assigned to them.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Continue
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
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
