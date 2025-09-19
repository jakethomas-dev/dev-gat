"use client"
import dynamic from "next/dynamic";
const SettingsPanel = dynamic(() => import("@/app/components/Settings/SettingsPanel"), { ssr: false });

export default function SettingsPage() {
  return <SettingsPanel />;
}
