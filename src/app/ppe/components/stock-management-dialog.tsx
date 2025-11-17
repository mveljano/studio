
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Boxes } from "lucide-react";
import { AddPpeDeliveryForm } from "../inventory/components/add-delivery-form";
import { StockLevels } from "../inventory/components/stock-levels";
import type { PPEEquipment } from "@/lib/types";

type StockManagementDialogProps = {
    equipment: PPEEquipment[];
}

export function StockManagementDialog({ equipment }: StockManagementDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Boxes className="mr-2 h-4 w-4" />
                    Manage Stock
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] grid-rows-[auto,1fr] gap-0 p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Stock Management</DialogTitle>
                    <DialogDescription>
                        View current stock levels and record new inbound deliveries of equipment.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid lg:grid-cols-2 gap-6 overflow-y-auto p-6 pt-0">
                    <StockLevels equipment={equipment} className="lg:col-span-1 self-start" />
                    <AddPpeDeliveryForm equipment={equipment} className="lg:col-span-1 self-start" />
                </div>
            </DialogContent>
        </Dialog>
    );
}
