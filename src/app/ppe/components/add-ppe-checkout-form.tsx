
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addPpeCheckout } from "@/lib/data";
import type { Employee, PPEEquipment } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  employeeId: z.string().min(1, { message: "Employee is required." }),
  equipmentId: z.string().min(1, { message: "Equipment is required." }),
  size: z.string().optional(),
  notes: z.string().optional(),
  isPremature: z.boolean().default(false),
});

type AddPpeCheckoutFormProps = {
    employees: Employee[];
    ppeEquipment: PPEEquipment[];
    ppeStock: Record<string, number>;
}

export function AddPpeCheckoutForm({ employees, ppeEquipment, ppeStock }: AddPpeCheckoutFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: "",
      equipmentId: "",
      size: "",
      notes: "",
      isPremature: false,
    },
  });

  const selectedEquipmentId = form.watch("equipmentId");
  const currentStock = selectedEquipmentId ? ppeStock[selectedEquipmentId] : undefined;

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const result = addPpeCheckout({
      ...values,
      checkoutDate: new Date().toISOString(),
    });

    if (result.success) {
      toast({
        title: "Success!",
        description: `Checkout has been recorded.`,
      });
      form.reset();
      router.refresh();
    } else {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: result.error,
        });
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees
                      .filter(e => e.status === 'Active')
                      .map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="equipmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ppeEquipment.map((item) => (
                      <SelectItem key={item.id} value={item.id} disabled={item.stock <= 0}>
                        {item.name} ({item.stock} in stock)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 {currentStock !== undefined && currentStock <= 0 && (
                    <FormDescription className="text-destructive">
                        This item is out of stock.
                    </FormDescription>
                 )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., M, L, 10, 42" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="isPremature"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Premature Replacement</FormLabel>
                  <FormDescription>
                    Is this replacing lost or damaged equipment before its renewal date?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
         <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Reason for premature replacement, etc..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <Button type="submit" disabled={loading || (currentStock !== undefined && currentStock <= 0)}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Checkout
        </Button>
      </form>
    </Form>
  );
}
