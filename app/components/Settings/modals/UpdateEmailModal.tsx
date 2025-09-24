"use client";
import React, { useState } from "react";
import { useSession } from "@/app/components/hooks/useSession";
import Modal from "@/app/components/ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
}

const UpdateEmailModal: React.FC<Props> = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refresh, updateUser } = useSession();
  const handleSave = async () => {
    if (saving) return;
    setSaving(true); setError(null);
    try {
      const res = await fetch('/api/settings/email', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update email');
      }
  // optimistic immediate update
  updateUser({ email });
  onClose();
  // ensure server state synced
  refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <Modal open={open} onClose={onClose} title="Update email" size="md" footer={
      <div className="flex justify-end gap-2">
        <button disabled={saving} className="px-3 py-1.5 border border-black rounded-sm bg-white hover:cursor-pointer hover:shadow-lg disabled:opacity-50 transition duration-150" onClick={onClose}>Cancel</button>
        <button disabled={saving || !email} className="px-3 py-1.5 border border-black rounded-sm bg-black text-white hover:cursor-pointer hover:shadow-lg disabled:opacity-50 transition duration-150" onClick={handleSave}>{saving ? 'Saving…' : 'Save'}</button>
      </div>
    }>
      <div className="space-y-3">
        <label className="block text-sm font-medium">New email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="w-full border border-black rounded-sm px-3 py-2 focus:outline-none focus:shadow-md transition duration-150"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </Modal>
  );
};

export default UpdateEmailModal;
