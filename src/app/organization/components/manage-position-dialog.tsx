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
import { addPositionAction, editPositionAction, removePositionAction } from "../actions";
import type { Department } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(2, "Position name must be at least 2 characters."),
});

type ManagePositionDialogProps = {
  department: Department;
  position?: string;
  onUpdate: () => void;
  children: React.ReactNode;
};

export function ManagePositionDialog({ department, position, onUpdate, children }: ManagePositionDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: position || "",
    },
  });

  const isEditing = !!position;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const result = isEditing
      ? await editPositionAction(department.name, position, values.name)
      : await addPositionAction(department.name, values.name);

    if (result.success) {
      toast({
        title: "Success!",
        description: `Position has been ${isEditing ? 'updated' : 'added'}.`,
      });
      onUpdate();
      setOpen(false);
      form.reset({ name: isEditing ? values.name : "" });
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
    const result = await removePositionAction(department.name, position);
    if (result.success) {
        toast({
          title: "Success!",
          description: `Position "${position}" has been removed.`,
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

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) form.reset({ name: position || "" });
    }}>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "Add"} Position</DialogTitle>
          <DialogDescription>
            {isEditing ? `Rename the position in the ${department.name} department.` : `Add a new position to the ${department.name} department.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                This action cannot be undone. This will permanently delete the <strong>{position}</strong> position.
                                You can only delete positions that have no employees assigned to them.
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
