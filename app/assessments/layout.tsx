"use client";

import SideBar from "@/components/custom/sidebar";

export default function AssessmentLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <SideBar>{children}</SideBar>;
}
