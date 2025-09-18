"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { ChevronRight, LogOut, Settings as SettingsIcon, User as UserIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface AuthNavbarProps {
  left?: ReactNode;              // Optional left content (breadcrumbs, title, etc.)
  right?: ReactNode;             // Optional right content override
  onProfileClick?: () => void;   // Handler for profile icon click
  className?: string;            // Extra class names
}

/**
 * AuthNavbar
 * A reusable top navigation bar for authenticated sections.
 * - White background, black bottom border
 * - Right-aligned profile icon by default
 * - Extensible via `left` and `right` slots
 */
export const AuthNavbar: React.FC<AuthNavbarProps> = ({
  left,
  right,
  onProfileClick,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (t && (btnRef.current?.contains(t) || menuRef.current?.contains(t))) return;
      close();
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
  <header className={`sticky top-0 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 h-14 flex items-center px-6 border-b border-black ${className} z-10`}>
      <div className="flex items-center flex-1 min-w-0">{left || null}</div>
      <div className="flex items-center gap-4">
        {right ? (
          right
        ) : (
          <div className="relative">
            <button
              ref={btnRef}
              type="button"
              aria-haspopup="menu"
              aria-expanded={open}
              aria-label="User profile"
              onClick={(e) => {
                onProfileClick?.();
                toggle();
              }}
              className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-black bg-white hover:shadow-xl hover:cursor-pointer transition-shadow focus:outline-none focus-visible:ring"
            >
              <UserIcon className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  key="menu"
                  ref={menuRef}
                  role="menu"
                  aria-label="Profile menu"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 6, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.4 }}
                  className="absolute right-0 mt-2 w-56 origin-top-right select-none"
                >
                  {/* Drop shadow panel */}
                  <div className="relative">
                    {/* Caret */}
                    <div className="absolute -top-[6px] right-8 h-3 w-3 rotate-45 bg-white border-l border-t border-black" />
                    <div className="rounded-md border border-black bg-white shadow-xl overflow-hidden">
                      {/* Header */}
                      <div className="px-3 py-2 border-b border-black/10">
                        <p className="text-sm font-semibold text-black truncate">Signed in</p>
                        <p className="text-xs text-black/60 truncate">you@example.com</p>
                      </div>

                      {/* Items */}
                      <div className="py-1">
                        <button
                          role="menuitem"
                          className="w-full px-3 py-2 text-left text-sm hover:bg-black/5 focus:bg-black/5 focus:outline-none flex items-center justify-between"
                          onClick={() => close()}
                        >
                          <span className="inline-flex items-center gap-2">
                            <UserIcon className="w-4 h-4" /> Profile
                          </span>
                          <ChevronRight className="w-4 h-4 opacity-50" />
                        </button>
                        <button
                          role="menuitem"
                          className="w-full px-3 py-2 text-left text-sm hover:bg-black/5 focus:bg-black/5 focus:outline-none flex items-center justify-between"
                          onClick={() => close()}
                        >
                          <span className="inline-flex items-center gap-2">
                            <SettingsIcon className="w-4 h-4" /> Settings
                          </span>
                          <ChevronRight className="w-4 h-4 opacity-50" />
                        </button>
                      </div>

                      {/* Sign out */}
                      <div className="border-t border-black/10">
                        <button
                          role="menuitem"
                          className="w-full px-3 py-2 text-left text-sm hover:bg-black/5 focus:bg-black/5 focus:outline-none flex items-center gap-2 text-red-600"
                          onClick={() => close()}
                        >
                          <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  );
};

export default AuthNavbar;
