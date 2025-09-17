"use client";
import React, { ReactNode } from "react";
import { User } from "lucide-react";

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
  return (
  <header className={`sticky top-0 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 h-14 flex items-center px-6 ${className} z-10`}>
      <div className="flex items-center flex-1 min-w-0">{left || null}</div>
      <div className="flex items-center gap-4">
        {right ? (
          right
        ) : (
          <button
            type="button"
            aria-label="User profile"
            onClick={onProfileClick}
            className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-black bg-white hover:shadow-xl hover:cursor-pointer transition-shadow focus:outline-none focus-visible:ring"
          >
            <User className="w-4 h-4" />
          </button>
        )}
      </div>
      <span aria-hidden="true" className="pointer-events-none absolute left-0 right-0 bottom-[-1px] h-px bg-black" />
    </header>
  );
};

export default AuthNavbar;
