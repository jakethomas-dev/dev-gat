"use client";
import React, { useState } from "react";
import Modal from "@/app/components/ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<Props> = ({ open, onClose }) => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (saving) return; setSaving(true); setError(null); setSuccess(false);
    try {
      const res = await fetch('/api/settings/password', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: current, newPassword: next, confirmPassword: confirm }) });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to change password');
      }
      setSuccess(true);
      setCurrent(""); setNext(""); setConfirm("");
      setTimeout(() => { setSuccess(false); onClose(); }, 1200);
    } catch (e: any) {
      setError(e.message);
    } finally { setSaving(false); }
  };
  return (
    <Modal open={open} onClose={onClose} title="Change password" size="md" footer={
      <div className="flex justify-end gap-2">
        <button disabled={saving} className="px-3 py-1.5 border border-black rounded-sm bg-white hover:cursor-pointer hover:shadow-lg disabled:opacity-50 transition duration-150" onClick={onClose}>Cancel</button>
        <button disabled={saving || !current || !next || next !== confirm || next.length < 8} className="px-3 py-1.5 border border-black rounded-sm bg-black text-white hover:cursor-pointer hover:shadow-lg disabled:opacity-50 transition duration-150" onClick={handleSave}>{saving ? 'Saving…' : 'Save'}</button>
      </div>
    }>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Current password</label>
          <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full border border-black rounded-sm px-3 py-2 focus:outline-none focus:shadow-md transition duration-150" />
        </div>
        <div>
          <label className="block text-sm font-medium">New password</label>
          <input type="password" value={next} onChange={(e) => setNext(e.target.value)} className="w-full border border-black rounded-sm px-3 py-2 focus:outline-none focus:shadow-md transition duration-150" />
        </div>
        <div>
          <label className="block text-sm font-medium">Confirm new password</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full border border-black rounded-sm px-3 py-2 focus:outline-none focus:shadow-md transition duration-150" />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {success && <p className="text-xs text-green-600">Password changed</p>}
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
