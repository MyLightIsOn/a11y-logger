"use client";

import SideBar from "@/components/custom/sidebar";

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <SideBar>{children}</SideBar>;
}
