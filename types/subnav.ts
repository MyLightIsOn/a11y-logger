import React from "react";

export interface SubNavConfigProps {
  text: string;
  variant:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "success"
    | "ghost"
    | null
    | undefined;
  action: () => void;
  icon: React.ReactNode;
}
