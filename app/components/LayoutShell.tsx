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
    // Minimal shell, no sidebar/title
    return (
      <Container>
        {children}
      </Container>
    );
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
