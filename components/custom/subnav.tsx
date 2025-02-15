import React from "react";
import { FileChartColumn, Edit, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

function Subnav({
  edit = false,
  generate = false,
  duplicate = false,
  trash = false,
}) {
  return (
    <div
      className={
        "w-full dark:bg-gray-900 bg-gray-50 border-b px-10 py-5 flex justify-end"
      }
    >
      <div className={"flex gap-2"}>
        {edit && (
          <Button>
            Edit <Edit />
          </Button>
        )}
        {duplicate && (
          <Button>
            Duplicate <Copy />
          </Button>
        )}
        {generate && (
          <Button>
            Generate Report <FileChartColumn />
          </Button>
        )}
        {trash && (
          <Button variant={"destructive"}>
            Delete <Trash2 />
          </Button>
        )}
      </div>
    </div>
  );
}

export default Subnav;
