
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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import type { PPEEquipment } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  renewalMonths: z.coerce.number().min(0, "Renewal period must be 0 or more."),
});

type ManagePpeEquipmentProps = {
  equipment: PPEEquipment[];
};

export function ManagePpeEquipment({ equipment }: ManagePpeEquipmentProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<PPEEquipment | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      renewalMonths: 0,
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEditingItem(null);
      form.reset();
    }
  };

  const handleEditClick = (item: PPEEquipment) => {
    setEditingItem(item);
    form.reset({
      name: item.name,
      renewalMonths: item.renewalMonths,
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const result = editingItem
      ? await editPpeEquipment(editingItem.id, values)
      : await addPpeEquipment(values);

    if (result.success) {
      toast({
        title: "Success!",
        description: `Equipment has been ${editingItem ? 'updated' : 'added'}.`,
      });
      setEditingItem(null);
      form.reset({ name: "", renewalMonths: 0 });
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: result.error || "Could not save equipment.",
      });
    }
    setLoading(false);
  }

  async function onRemoveItem(equipmentId: string) {
    setLoading(true);
    const result = await removePpeEquipment(equipmentId);
    if (result.success) {
      toast({
        title: "Success!",
        description: `Equipment has been removed.`,
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
    <Dialog onOpenChange={handleOpenChange} open={!!editingItem}>
      <Card>
        <CardHeader>
          <CardTitle>Manage Equipment</CardTitle>
          <CardDescription>
            Add, edit, or remove equipment types from the checkout list.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="name"
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
                    <FormField
                    control={form.control}
                    name="renewalMonths"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Renewal Period (Months)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 12" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" disabled={loading} className="w-full">
                    {loading && form.formState.isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
                    ) : "Add New Equipment"}
                    </Button>
                </form>
            </Form>
          <Separator className="my-6" />
          <div className="space-y-2">
              <h4 className="font-medium text-sm">Existing Equipment</h4>
              <ScrollArea className="h-64 rounded-md border">
                  <div className="p-4 text-sm">
                  {equipment.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-1 group">
                          <div>
                            <p>{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.renewalMonths > 0 ? `${item.renewalMonths} month renewal` : 'No renewal'}</p>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditClick(item)}>
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                              </Button>
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
                                              This will permanently remove "{item.name}" from the equipment list. This action cannot be undone.
                                          </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => onRemoveItem(item.id)} className="bg-destructive hover:bg-destructive/90">
                                              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                              Continue
                                          </AlertDialogAction>
                                      </AlertDialogFooter>
                                  </AlertDialogContent>
                              </AlertDialog>
                          </div>
                      </div>
                  ))}
                  {equipment.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No equipment defined.</p>
                  )}
                  </div>
              </ScrollArea>
          </div>
        </CardContent>
      </Card>
      <DialogContent>
        <DialogHeader>
            <DialogTitle>Edit Equipment Name</DialogTitle>
            <DialogDescription>
                Rename the equipment item from "{editingItem?.name}".
            </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form id="edit-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
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
                <FormField
                  control={form.control}
                  name="renewalMonths"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Renewal Period (Months)</FormLabel>
                      <FormControl>
                          <Input type="number" {...field} />
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
            <Button type="submit" form="edit-form" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
