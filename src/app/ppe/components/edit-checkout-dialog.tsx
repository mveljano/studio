
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
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { PPECheckout } from "@/lib/types";
import { updatePpeCheckout } from "../actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";

const formSchema = z.object({
  size: z.string().optional(),
  notes: z.string().optional(),
  isPremature: z.boolean(),
});

type EditCheckoutDialogProps = {
  checkout: PPECheckout & { employeeName: string; equipmentName: string; };
};

export function EditCheckoutDialog({ checkout }: EditCheckoutDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: checkout.size || "",
      notes: checkout.notes || "",
      isPremature: checkout.isPremature,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    
    const updatedRecord: PPECheckout = {
      ...checkout,
      ...values,
    };
    
    const result = await updatePpeCheckout(updatedRecord);

    if (result.success) {
      toast({
        title: "Success!",
        description: "Checkout record has been updated.",
      });
      setOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: result.error || "Could not update the record.",
      });
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit Record</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Checkout Record</DialogTitle>
          <DialogDescription>
            Update the details for this PPE checkout record.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
            <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right text-muted-foreground">Employee</p>
                <p className="col-span-3 font-medium">{checkout.employeeName}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right text-muted-foreground">Equipment</p>
                <p className="col-span-3 font-medium">{checkout.equipmentName}</p>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right text-muted-foreground">Date</p>
                <p className="col-span-3 font-medium">{format(new Date(checkout.checkoutDate), "yyyy-MM-dd")}</p>
            </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Size</FormLabel>
                  <FormControl className="col-span-3">
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Notes</FormLabel>
                  <FormControl className="col-span-3">
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="isPremature"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Premature</FormLabel>
                    <FormControl className="col-span-3">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is-premature"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            <label htmlFor="is-premature" className="text-sm text-muted-foreground">Is this a premature replacement?</label>
                        </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
