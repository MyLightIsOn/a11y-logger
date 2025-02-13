import React from "react";
import { FileChartColumn, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function Subnav(props) {
  return (
    <div
      className={
        "w-full dark:bg-gray-900 bg-gray-50 border-b px-10 py-5 flex justify-end"
      }
    >
      {/*<div className={"flex"}>
        <SquareChevronLeft />
        <div className={"px-5"}>Assessment 1 of 10</div> <SquareChevronRight />
      </div>*/}
      <div className={"flex gap-2"}>
        <Button>
          Edit <Edit />
        </Button>
        <Button>
          Generate Report <FileChartColumn />
        </Button>
        <Button variant={"destructive"}>
          Delete <Trash2 />
        </Button>
      </div>
    </div>
  );
}

export default Subnav;
