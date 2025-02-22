import React from "react";
import { FileChartColumn, Edit, Trash2, Copy, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

function Subnav({
  edit = false,
  generate = false,
  duplicate = false,
  trash = false,
  add = false,
  onClickAction,
}) {
  return (
    <div
      className={
        "w-full dark:bg-gray-900 bg-gray-50 border-b px-10 py-5 flex justify-end"
      }
    >
      <div className={"flex gap-2"}>
        {add && (
          <Button
            variant={"success"}
            onClick={() => onClickAction("add-issue")}
          >
            Add <Plus />
          </Button>
        )}
        {edit && (
          <Button onClick={() => onClickAction("edit")}>
            Edit <Edit />
          </Button>
        )}
        {duplicate && (
          <Button onClick={() => onClickAction("duplicate")}>
            Duplicate <Copy />
          </Button>
        )}
        {generate && (
          <Button onClick={() => onClickAction("generate")}>
            Generate Report <FileChartColumn />
          </Button>
        )}
        {trash && (
          <Button
            variant={"destructive"}
            onClick={() => onClickAction("trash")}
          >
            Delete <Trash2 />
          </Button>
        )}
      </div>
    </div>
  );
}

export default Subnav;
