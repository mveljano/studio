"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PPECheckout } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, AlertCircle, CheckCircle2, Clock, Info, ShieldAlert } from "lucide-react";
import { EditCheckoutDialog } from "./edit-checkout-dialog";
import { addMonths, differenceInDays, format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type PPECheckoutRow = PPECheckout & { 
  employeeName: string; 
  equipmentName: string;
  renewalMonths: number;
};

const handleDelete = (checkoutId: string) => {
    // Placeholder for delete functionality
    console.log("Deleting checkout:", checkoutId);
    alert("Delete functionality not yet implemented.");
};

const RenewalStatus = ({ row }: { row: { original: PPECheckoutRow } }) => {
    const { checkoutDate, renewalMonths, isPremature } = row.original;

    if (isPremature) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Badge variant="secondary" className="cursor-help">
                            <ShieldAlert className="mr-1 h-3 w-3"/>
                            Premature
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>This was a premature replacement.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    if (renewalMonths === 0) {
        return <Badge variant="outline">No Renewal</Badge>;
    }
    
    const renewalDate = addMonths(parseISO(checkoutDate), renewalMonths);
    const daysUntilRenewal = differenceInDays(renewalDate, new Date());

    if (daysUntilRenewal < 0) {
        return (
            <Badge variant="destructive">
                <AlertCircle className="mr-1 h-3 w-3"/>
                Overdue ({Math.abs(daysUntilRenewal)} days)
            </Badge>
        )
    }
    if (daysUntilRenewal <= 30) {
        return (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800">
                <Clock className="mr-1 h-3 w-3"/>
                Due in {daysUntilRenewal} days
            </Badge>
        )
    }
    return (
        <Badge variant="outline" className="border-green-300 text-green-700 dark:border-green-800 dark:text-green-400">
            <CheckCircle2 className="mr-1 h-3 w-3"/>
            OK (renews {format(renewalDate, 'MMM yyyy')})
        </Badge>
    );
};


export const columns: ColumnDef<PPECheckoutRow>[] = [
  {
    accessorKey: "employeeName",
    header: "Employee",
  },
  {
    accessorKey: "equipmentName",
    header: "Equipment",
  },
  {
    accessorKey: "checkoutDate",
    header: "Checkout Date",
    cell: ({ row }) => format(parseISO(row.original.checkoutDate), "yyyy-MM-dd"),
  },
  {
    id: "renewalStatus",
    header: "Renewal Status",
    cell: ({ row }) => <RenewalStatus row={row} />,
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const checkout = row.original;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <EditCheckoutDialog checkout={checkout}>
                Edit Record
              </EditCheckoutDialog>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                onClick={() => handleDelete(checkout.id)}
              >
                Delete Record
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
