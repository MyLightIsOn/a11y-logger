import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function CustomDialog({ open, onOpenChange, content }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>{content.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">{content.content}</div>
        <DialogFooter>{content.actions?.map((action) => action)}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CustomDialog;
