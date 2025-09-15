"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

type Section = "dashboard" | "applications" | "settings" | string;

type SectionContextValue = {
  section: Section;
  setSection: (s: Section) => void;
};

const SectionContext = createContext<SectionContextValue | null>(null);

export function SectionProvider({ children, initial }: { children: React.ReactNode; initial?: Section }) {
  const [section, setSection] = useState<Section>(initial ?? "dashboard");

  const value = useMemo(() => ({ section, setSection }), [section]);

  return <SectionContext.Provider value={value}>{children}</SectionContext.Provider>;
}

export function useSection() {
  const ctx = useContext(SectionContext);
  if (!ctx) throw new Error("useSection must be used within a SectionProvider");
  return ctx;
}

export function formatSectionTitle(section: Section) {
  if (!section) return "";
  // simple title-case for labels like "applications"
  return section
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export type { Section };
