"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "name",
    header: "Assessment",
  },
  {
    accessorKey: "progress",
    header: "Status",
  },
  {
    accessorKey: "platform",
    header: "Platform",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const formattedDate = formatDate(row.original.createdAt);

      return formattedDate;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Update",
    cell: ({ row }) => {
      const formattedDate = formatDate(row.original.updatedAt);

      return formattedDate;
    },
  },
];
