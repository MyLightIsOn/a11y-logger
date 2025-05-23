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
import { chartConfig } from "@/static/chart-setup";
import { sharingAssessments } from "@/components/custom/dialog/dialog-content";
import { Feature } from "@/components/icons/feature";

interface RowProps {
  row: {
    index: number;
    original: Assessments;
  };
}

interface Schema {
  heading: string;
  displayName: string;
  type: string;
}

export const renderColumns = (
  data: { documentId: string }[],
  schema: Schema[],
  type: string,
  setOpen,
  setDialogContent,
) => {
  const dialogActions = [
    <Button
      key={"submit-dialog"}
      type="submit"
      onClick={() => {
        setOpen(false);
        console.log("closing");
      }}
    >
      Interested
    </Button>,
    <Button
      key={"cancel-dialog"}
      variant={"ghost"}
      onClick={() => setOpen(false)}
    >
      Not Interested
    </Button>,
  ];

  const columns: ColumnDef<Assessments>[] = [];
  schema.map((columnData) => {
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
      cell: ({ row }: RowProps) => {
        if (columnData.type === "date") {
          return formatDate(row.original[columnData.heading]);
        }

        if (columnData.heading === "severity") {
          return chartConfig[data[row.index].severity].label;
        }

        return (
          <a
            className={"hover:underline focus:underline"}
            href={`/${type}/${data[row.index]?.documentId}`}
          >
            {row.original[columnData.heading]}
          </a>
        );
      },
    });
  });

  columns.push({
    id: "actions",
    cell: ({ row }) => {
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
            <DropdownMenuItem
              onClick={() => {
                sharingAssessments.actions = dialogActions;
                setDialogContent(sharingAssessments);
                setOpen(true);
              }}
            >
              Share <Feature />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <a
                className={"hover:underline focus:underline"}
                href={`/${type}/${data[row.index]?.documentId}`}
              >
                View
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  });
  return columns;
};
