"use client";
import { useState, useEffect, useRef } from "react";

export default function NavBar() {
    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const toggleRef = useRef<HTMLButtonElement | null>(null);

    // Close on escape
    useEffect(() => {
        if (!open) return;
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    // Close when clicking outside
    useEffect(() => {
        if (!open) return;
        function onDoc(e: MouseEvent) {
            const target = e.target as Node;
            if (toggleRef.current && toggleRef.current.contains(target)) return; // ignore clicks on toggle
            if (panelRef.current && !panelRef.current.contains(target)) setOpen(false);
        }
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, [open]);

    const navLinks = [
        { label: "Pricing", href: "#" },
        { label: "Gallery", href: "#" },
        { label: "Blog", href: "#" },
    ];

    return (
        <div className="mx-auto border-b">
            <div className="relative w-full px-6 md:px-12 py-4 md:py-8 bg-sidebar">
                <nav
                    className="relative flex items-center justify-between md:justify-center"
                    aria-label="Global"
                >
                    {/* Left / Brand + Mobile Toggle */}
                    <div className="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
                        <div className="flex items-center justify-between w-full md:w-auto">
                            <a href="#" className="flex items-center gap-2">
                                <span className="sr-only">Development Gateway</span>
                                <img
                                    className="h-8 w-auto sm:h-10"
                                    src="https://www.svgrepo.com/show/448244/pack.svg"
                                    loading="lazy"
                                    width="202"
                                    height="40"
                                    alt="Development Gateway Logo"
                                />
                            </a>
                            <div className="flex items-center -mr-2 md:hidden">
                                <button
                                    ref={toggleRef}
                                    className="inline-flex items-center justify-center p-2 text-black bg-white border border-black rounded-md hover:bg-black/5 transition-colors focus:outline-none"
                                    type="button"
                                    aria-expanded={open}
                                    aria-controls="mobile-menu"
                                    onClick={() => setOpen((o) => !o)}
                                >
                                    <span className="sr-only">{open ? "Close main menu" : "Open main menu"}</span>
                                    {open ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            fill="none"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <ul className="hidden md:flex md:space-x-10 list-none">
                        {navLinks.map((l) => (
                            <li key={l.label}>
                                <a
                                    href={l.href}
                                    className="text-base font-normal text-black/70 hover:text-black transition-colors"
                                >
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                        {/* Desktop CTA */}
                    <div className="hidden md:absolute md:flex md:items-center md:justify-end md:inset-y-0 md:right-0">
                        <div className="inline-flex rounded-md">
                            <a
                                href="/signIn"
                                className="inline-flex items-center px-4 py-2 text-base text-black bg-white border border-black rounded-md hover:bg-black/5 transition-colors"
                            >
                                Sign in
                            </a>
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu Panel */}
                <div
                    id="mobile-menu"
                    ref={panelRef}
                    className={`md:hidden overflow-hidden border border-black border-t-0 rounded-b-md bg-white transform transition-all duration-300 origin-top z-40 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                    aria-hidden={!open}
                >
                    <ul className="flex flex-col py-4">
                        {navLinks.map((l) => (
                            <li key={l.label}>
                                <a
                                    href={l.href}
                                    className="block px-6 py-3 text-sm font-medium text-black hover:bg-black/5 transition-colors"
                                    onClick={() => setOpen(false)}
                                >
                                    {l.label}
                                </a>
                            </li>
                        ))}
                        <li className="mt-2 px-6">
                            <a
                                href="/signIn"
                                className="flex w-full items-center justify-center gap-2 rounded-md border border-black bg-white px-4 py-2 text-sm font-medium text-black hover:bg-black/5 transition-colors"
                                onClick={() => setOpen(false)}
                            >
                                Sign in
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
