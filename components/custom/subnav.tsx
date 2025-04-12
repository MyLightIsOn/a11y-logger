import React from "react";
import { Button } from "@/components/ui/button";
import { SubNavConfigProps } from "@/types/subnav";

interface SubnavProps {
  config: SubNavConfigProps[];
}

function Subnav({ config }: SubnavProps) {
  return (
    <div
      className={
        "w-full dark:bg-gray-900 bg-gray-50 border-b px-10 py-5 flex justify-end"
      }
    >
      <div className={"flex gap-2"}>
        {config.map((button: SubNavConfigProps) => {
          return (
            <Button
              key={button.text}
              variant={button.variant}
              onClick={() => button.action()}
            >
              {button.text} {button.icon}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default Subnav;
