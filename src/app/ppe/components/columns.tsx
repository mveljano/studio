
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PPECheckout } from "@/lib/types";

type PPECheckoutRow = PPECheckout & { employeeName: string };

export const columns: ColumnDef<PPECheckoutRow>[] = [
  {
    accessorKey: "employeeName",
    header: "Employee",
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
];
