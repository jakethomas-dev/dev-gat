"use client";
import React from "react";
import { usePathname } from "next/navigation";

function format(s: string) {
  if (!s) return "Dashboard";
  return s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function PageTitle({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const seg = (pathname || "/").split("/").filter(Boolean)[0] || "dashboard";
  const title = format(seg);
  return <h1 className={`text-xl font-bold mb-4 ${className}`.trim()}>{title}</h1>;
}
