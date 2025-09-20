"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, SquarePen, Settings, ArrowLeft, ArrowRight, type LucideIcon, Plus, PlusIcon } from "lucide-react";
import { useSection } from "./SectionProvider";
import { useRouter } from "next/navigation";

type MenuItem = { icon: LucideIcon; label: string; key: string; href: string };

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Home", key: "dashboard", href: "/dashboard" },
  { icon: SquarePen, label: "Applications", key: "applications", href: "/dashboard/applications" },
  { icon: Settings, label: "Settings", key: "settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const router = useRouter();
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

  // Prefetch common sidebar routes on idle to speed up first navigation
  useEffect(() => {
    const routes = ["/dashboard", "/dashboard/applications", "/dashboard/settings"];
    let idleId: number | null = null;
    let timeoutId: number | null = null;

    const prefetchAll = () => routes.forEach((r) => router.prefetch(r));

    type ExtendedWindow = Window & {
      requestIdleCallback?: (
        callback: (deadline: { timeRemaining: () => number; didTimeout: boolean }) => void,
        opts?: { timeout?: number }
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const win = window as ExtendedWindow;

    if (typeof win.requestIdleCallback === "function") {
      idleId = win.requestIdleCallback(() => prefetchAll(), { timeout: 1500 });
    } else {
      timeoutId = window.setTimeout(prefetchAll, 300);
    }

    return () => {
      if (idleId !== null && typeof win.cancelIdleCallback === "function") {
        win.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [router]);

  return (
    <aside className={`relative h-screen bg-sidebar border-r border-black text-black flex flex-col transition-all duration-300 ${expanded ? "shadow-2xl" : "shadow-none"} ${sidebarWidth}`}>
  <div className={`relative flex items-center ${expanded ? "justify-start px-4 bg-white" : "bg-white justify-center px-2"} h-14 border-b border-black`}>        
        <div className="relative flex items-center w-full justify-center">
          {/* Full logo (shown when expanded) */}
          <span
            className={`transition-all origin-left flex items-center ${expanded ? "opacity-100 scale-100" : "opacity-0 -translate-x-2 scale-95"}`}
            aria-hidden={!expanded}
          >
            <Image
              src="/dg_full_logo.svg"
              width={581}
              height={156}
              priority
              alt="Development Gateway full logo"
              className="h-6 w-auto select-none"
            />
          </span>
          {/* Compact icon (shown when collapsed) */}
            <span
              className={`absolute left-1/2 -translate-x-1/2 transition-all ${expanded ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"}`}
            >
              <Image
                src="/dg_icon_logo.svg"
                width={24}
                height={24}
                priority
                alt="Development Gateway icon logo"
              />
            </span>
        </div>
      </div>

      <button
        className="absolute right-0 top-4 translate-x-1/2 z-20 bg-white border border-black rounded-full w-8 h-8 flex items-center justify-center text-black hover:cursor-pointer hover:shadow-lg"
        type="button"
        aria-expanded={expanded}
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
      </button>

      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-2">
          <button
            type="button"
            className="mx-auto w-full bg-black text-white text-sm px-6 py-2 rounded-lg hover:cursor-pointer hover:shadow-lg transition-all duration-150 flex items-center justify-between"
          >
            <span className="text-left">Create Application</span>
            <PlusIcon className="w-4 h-4" />
          </button>
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = section === item.key;
            return (
              <li key={idx} className="mx-auto w-full">
                <Link
                  href={item.href}
                  className={`relative flex items-center w-full mx-auto py-3 ${expanded ? "pl-4 pr-2" : "pl-0 pr-0"} rounded-md transition-colors duration-200 ${isActive ? "bg-black/5 hover:bg-black/10 border" : "hover:bg-black/5 "}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setSection(item.key)}
                  onMouseEnter={() => router.prefetch(item.href)}
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
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
