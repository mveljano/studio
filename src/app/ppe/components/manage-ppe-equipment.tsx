
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
import { addPpeEquipment } from "../actions";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  equipmentName: z.string().min(2, {
    message: "Equipment name must be at least 2 characters.",
  }),
});

type ManagePpeEquipmentProps = {
  equipment: string[];
};

export function ManagePpeEquipment({ equipment }: ManagePpeEquipmentProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipmentName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const result = await addPpeEquipment(values.equipmentName);
    if (result.success) {
      toast({
        title: "Success!",
        description: `"${values.equipmentName}" has been added to the equipment list.`,
      });
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: result.error || "Could not add equipment.",
      });
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Equipment</CardTitle>
        <CardDescription>
          Add new equipment types to the checkout list.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
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
              {loading ? (
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
                    <div key={item} className="py-1">{item}</div>
                ))}
                </div>
            </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
