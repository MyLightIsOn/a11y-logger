"use client";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

function Loader({ text }: { readonly text: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      <p>{text}</p>
    </div>
  );
}

interface SubmitButtonProps {
  text: string;
  loadingText: string;
  className?: string;
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  form?: string;
}

export function SubmitButton({
  text,
  loadingText,
  loading,
  className,
  onClick,
  form,
}: Readonly<SubmitButtonProps>) {
  const status = useFormStatus();
  return (
    <Button
      form={form}
      type="submit"
      aria-disabled={status.pending || loading}
      disabled={status.pending || loading}
      className={cn(className)}
      onClick={onClick}
    >
      {status.pending || loading ? <Loader text={loadingText} /> : text}
    </Button>
  );
}
