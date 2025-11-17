
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PPECheckout } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { EditCheckoutDialog } from "./edit-checkout-dialog";

type PPECheckoutRow = PPECheckout & { employeeId: string; employeeName: string };

const handleDelete = (checkoutId: string) => {
    // Placeholder for delete functionality
    console.log("Deleting checkout:", checkoutId);
    alert("Delete functionality not yet implemented.");
};

export const columns: ColumnDef<PPECheckoutRow>[] = [
  {
    accessorKey: "employeeId",
    header: "Employee ID",
  },
  {
    accessorKey: "equipment",
    header: "Equipment",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "checkoutDate",
    header: "Checkout Date",
  },
  {
    accessorKey: "notes",
    header: "Notes",
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
              <DropdownMenuItem asChild>
                <EditCheckoutDialog checkout={checkout} />
              </DropdownMenuItem>
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
