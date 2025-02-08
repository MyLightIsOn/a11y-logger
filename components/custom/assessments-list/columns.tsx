"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Assessments } from "@/types/assessments";

const columnsSchema = [
  { heading: "name", displayName: "Assessment", type: "string" },
  { heading: "progress", displayName: "Status", type: "string" },
  { heading: "platform", displayName: "Platform", type: "string" },
  { heading: "createdAt", displayName: "Created", type: "date" },
  { heading: "updatedAt", displayName: "Last Update", type: "date" },
];

export const renderColumns = () => {
  const columns: ColumnDef<Assessments>[] = [];

  columnsSchema.map((columnData) => {
    columns.push({
      accessorKey: columnData.heading,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {columnData.displayName}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      //TODO fix type
      cell: ({ row }: { row: { original: any } }) => {
        if (columnData.type === "date") {
          return formatDate(row.original[columnData.heading]);
        }

        return row.original[columnData.heading];
      },
    });
  });

  columns.push({
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log("share assessment")}>
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  });
  return columns;
};
