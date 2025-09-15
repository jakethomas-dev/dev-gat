"use client";
import React, { useLayoutEffect } from "react";
import { SectionProvider, useSection } from "./SectionProvider";
import { usePathname } from "next/navigation";

function SectionSync() {
  const pathname = usePathname();
  const { section, setSection } = useSection();
  useLayoutEffect(() => {
    const seg = (pathname || "/").split("/").filter(Boolean)[0];
    const computed = seg ? seg.toLowerCase() : "dashboard";
    if (section !== computed) setSection(computed);
  }, [pathname, section, setSection]);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const firstSeg = (pathname || "/").split("/").filter(Boolean)[0];
  const initial = (firstSeg ? firstSeg.toLowerCase() : "dashboard") as any;
  return (
    <SectionProvider initial={initial}>
      <SectionSync />
      {children}
    </SectionProvider>
  );
}
