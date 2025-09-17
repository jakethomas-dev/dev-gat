"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Container from "./Container";
import Sidebar from "./Sidebar";
import PageTitle from "./PageTitle";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  // Define routes that should NOT show the app chrome (sidebar/title)
  const firstSeg = pathname.split("/").filter(Boolean)[0] || "";
  const isPublic = pathname === "/" || firstSeg === "signIn" || firstSeg === "register";

  if (isPublic) {
    // No Container wrapper so content (e.g., a full-width navbar / hero) can span the viewport
    return <>{children}</>;
  }

  return (
    <Container sidebar={<Sidebar />}>
      <div className="max-w-5xl mx-auto">
        <PageTitle />
      </div>
      {children}
    </Container>
  );
}
