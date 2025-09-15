"use client";
import React, { useLayoutEffect } from "react";
import { SectionProvider, useSection } from "./SectionProvider";
import { usePathname } from "next/navigation";

function SectionSync() {
  const pathname = usePathname();
  const { section, setSection } = useSection();
  useLayoutEffect(() => {
    const parts = (pathname || "/").split("/").filter(Boolean);
    const seg = parts[0];
    const computed = seg === "dashboard" ? (parts[1] || "dashboard").toLowerCase() : (seg ? seg.toLowerCase() : "dashboard");
    if (section !== computed) setSection(computed);
  }, [pathname, section, setSection]);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const parts = (pathname || "/").split("/").filter(Boolean);
  const firstSeg = parts[0];
  const initial = (firstSeg === "dashboard" ? (parts[1] || "dashboard") : (firstSeg || "dashboard")).toLowerCase() as any;
  return (
    <SectionProvider initial={initial}>
      <SectionSync />
      {children}
    </SectionProvider>
  );
}
