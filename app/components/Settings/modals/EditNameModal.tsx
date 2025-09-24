"use client";
import React, { useState } from "react";
import Modal from "@/app/components/ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
}

const EditNameModal: React.FC<Props> = ({ open, onClose }) => {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (saving) return; setSaving(true); setError(null);
    try {
      const res = await fetch('/api/settings/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ forename: first, surname: last }) });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update name');
      }
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally { setSaving(false); }
  };
  return (
    <Modal open={open} onClose={onClose} title="Edit name" size="md" footer={
      <div className="flex justify-end gap-2">
        <button disabled={saving} className="px-3 py-1.5 border border-black rounded-sm bg-white hover:cursor-pointer hover:shadow-lg disabled:opacity-50 transition duration-150" onClick={onClose}>Cancel</button>
        <button disabled={saving || !first.trim() || !last.trim()} className="px-3 py-1.5 border border-black rounded-sm bg-black text-white hover:cursor-pointer hover:shadow-lg disabled:opacity-50 transition duration-150" onClick={handleSave}>{saving ? 'Saving…' : 'Save'}</button>
      </div>
    }>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">First name</label>
          <input value={first} onChange={(e) => setFirst(e.target.value)} className="w-full border border-black rounded-sm px-3 py-2 focus:outline-none focus:shadow-md transition duration-150" />
        </div>
        <div>
          <label className="block text-sm font-medium">Last name</label>
          <input value={last} onChange={(e) => setLast(e.target.value)} className="w-full border border-black rounded-sm px-3 py-2 focus:outline-none focus:shadow-md transition duration-150" />
        </div>
        {error && <div className="sm:col-span-2 text-xs text-red-600">{error}</div>}
      </div>
    </Modal>
  );
};

export default EditNameModal;
