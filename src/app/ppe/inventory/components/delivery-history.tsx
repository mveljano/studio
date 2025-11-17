"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PPEEquipment, PPEInboundDelivery } from "@/lib/types";

type DeliveryHistoryProps = {
  deliveries: PPEInboundDelivery[];
  equipment: PPEEquipment[];
};

export function DeliveryHistory({ deliveries, equipment }: DeliveryHistoryProps) {
  const getEquipmentName = (id: string) => {
    return equipment.find(e => e.id === id)?.name || 'Unknown';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inbound Delivery History</CardTitle>
        <CardDescription>
          A log of all received PPE shipments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveries.map((delivery) => (
              <TableRow key={delivery.id}>
                <TableCell>{delivery.deliveryDate}</TableCell>
                <TableCell className="font-medium">{getEquipmentName(delivery.equipmentId)}</TableCell>
                <TableCell className="text-right font-mono">+{delivery.quantity}</TableCell>
                <TableCell className="text-muted-foreground truncate max-w-xs">{delivery.notes}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                      <DropdownMenuItem disabled className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
             {deliveries.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No deliveries recorded yet.</TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
