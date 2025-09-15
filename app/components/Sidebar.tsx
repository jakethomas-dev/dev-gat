"use client";
import { useState, useEffect } from "react";
import { useSection } from "./SectionProvider";
import Link from "next/link";
import { LayoutDashboard, SquarePen, Settings, ArrowLeft, ArrowRight, type LucideIcon } from "lucide-react";

type MenuItem = { icon: LucideIcon; label: string; key: string };
const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Home", key: "dashboard" },
  { icon: SquarePen, label: "Applications", key: "applications" },
  { icon: Settings, label: "Settings", key: "settings" },
];

const Sidebar = () => {
  // true = expanded, false = compact
  const [expanded, setExpanded] = useState(true);
  // Persist expanded state so navigation doesn't reset it
  const EXPAND_KEY = "dg.sidebar-expanded";
  useEffect(() => {
    try {
      const saved = typeof window !== "undefined" ? window.localStorage.getItem(EXPAND_KEY) : null;
      if (saved != null) setExpanded(saved === "true");
    } catch {}
  }, []);
  useEffect(() => {
    try {
      if (typeof window !== "undefined") window.localStorage.setItem(EXPAND_KEY, String(expanded));
    } catch {}
  }, [expanded]);
  const { section, setSection } = useSection();

  const sidebarWidth = expanded ? "w-64" : "w-20";

  return (
    <aside className={`relative h-screen bg-white border-r border-black text-black flex flex-col transition-all duration-300 ${expanded ? "shadow-2xl" : "shadow-none"} ${sidebarWidth}`}>
      {/* Header */}
      <div className={`relative flex items-center ${expanded ? "justify-start px-4" : "justify-center px-2"} py-4 border-b border-black`}>
        <span className={`text-center mx-auto font-bold text-base whitespace-nowrap overflow-hidden transition-all ${expanded ? "opacity-100 duration-300" : "opacity-0 duration-200"}`}>
          Development Gateway
        </span>
      </div>

      {/* Edge toggle button, positioned consistently on the right border */}
  <button
        className="absolute right-0 top-4 translate-x-1/2 z-20 bg-white border border-black rounded-full w-8 h-8 flex items-center justify-center text-black hover:cursor-pointer hover:shadow-lg"
        type="button"
        aria-expanded={expanded}
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-2">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = section === item.key;
            return (
            <li key={idx} className="mx-auto w-full">
              <Link
                href={`/${item.key === "dashboard" ? "" : item.key}`}
                prefetch
                className={`relative flex items-center w-full mx-auto py-3 ${expanded ? "pl-4 pr-2" : "pl-0 pr-0"} rounded-md transition-colors duration-200 ${isActive ? "bg-black/5 hover:bg-black/10" : "hover:bg-black/5"}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  // Only set the section; do not toggle expanded state
                  setSection(item.key);
                }}
              >
                <span
                  className={`absolute top-1/2 -translate-y-1/2 transition-all duration-300 ${expanded ? "left-4 translate-x-0" : "left-1/2 -translate-x-1/2"}`}
                >
                  <Icon className={`${expanded ? "scale-100" : "scale-125"} w-4 h-4 transition-transform duration-300`} />
                </span>
                <span
                  className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all ${expanded ? "pl-6 max-w-[160px] opacity-100 duration-300" : "pl-0 max-w-0 opacity-0 duration-200"}`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );})}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
