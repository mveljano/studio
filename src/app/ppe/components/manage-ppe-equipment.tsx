
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { addPpeEquipment, editPpeEquipment, removePpeEquipment } from "../actions";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
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
} from "@/components/ui/alert-dialog";
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

const addFormSchema = z.object({
  equipmentName: z.string().min(2, {
    message: "Equipment name must be at least 2 characters.",
  }),
});

const editFormSchema = z.object({
    newName: z.string().min(2, {
      message: "Equipment name must be at least 2 characters.",
    }),
  });

type ManagePpeEquipmentProps = {
  equipment: string[];
};

export function ManagePpeEquipment({ equipment }: ManagePpeEquipmentProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const addForm = useForm<z.infer<typeof addFormSchema>>({
    resolver: zodResolver(addFormSchema),
    defaultValues: {
      equipmentName: "",
    },
  });

  const editForm = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
  });

  async function onAddSubmit(values: z.infer<typeof addFormSchema>) {
    setLoading(true);
    const result = await addPpeEquipment(values.equipmentName);
    if (result.success) {
      toast({
        title: "Success!",
        description: `"${values.equipmentName}" has been added to the equipment list.`,
      });
      addForm.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: result.error || "Could not add equipment.",
      });
    }
    setLoading(false);
  }

  async function onEditSubmit(oldName: string, values: z.infer<typeof editFormSchema>) {
    setLoading(true);
    const result = await editPpeEquipment(oldName, values.newName);
    if (result.success) {
      toast({
        title: "Success!",
        description: `"${oldName}" has been renamed to "${values.newName}".`,
      });
      setEditingItem(null);
    } else {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: result.error || "Could not rename equipment.",
        });
    }
    setLoading(false);
  }

  async function onRemoveItem(equipmentName: string) {
    setLoading(true);
    const result = await removePpeEquipment(equipmentName);
    if (result.success) {
      toast({
        title: "Success!",
        description: `"${equipmentName}" has been removed.`,
      });
    } else {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: result.error || "Could not remove equipment.",
        });
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Equipment</CardTitle>
        <CardDescription>
          Add, edit, or remove equipment types from the checkout list.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...addForm}>
          <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
            <FormField
              control={addForm.control}
              name="equipmentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Equipment Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Face Shield" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading && addForm.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Equipment"
              )}
            </Button>
          </form>
        </Form>
        <Separator className="my-6" />
        <div className="space-y-2">
            <h4 className="font-medium text-sm">Existing Equipment</h4>
            <ScrollArea className="h-64 rounded-md border">
                <div className="p-4 text-sm">
                {equipment.map((item) => (
                    <div key={item} className="flex items-center justify-between py-1 group">
                        <span>{item}</span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Dialog open={editingItem === item} onOpenChange={(open) => setEditingItem(open ? item : null)}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => editForm.setValue('newName', item)}>
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Equipment Name</DialogTitle>
                                        <DialogDescription>
                                            Rename the equipment item from "{item}".
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Form {...editForm}>
                                        <form id={`edit-form-${item}`} onSubmit={editForm.handleSubmit((values) => onEditSubmit(item, values))} className="space-y-4">
                                            <FormField
                                            control={editForm.control}
                                            name="newName"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>New Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                            />
                                        </form>
                                    </Form>
                                     <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="ghost">Cancel</Button>
                                        </DialogClose>
                                        <Button type="submit" form={`edit-form-${item}`} disabled={loading}>
                                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                            Save Changes
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently remove "{item}" from the equipment list. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => onRemoveItem(item)} className="bg-destructive hover:bg-destructive/90">
                                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                            Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))}
                </div>
            </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
