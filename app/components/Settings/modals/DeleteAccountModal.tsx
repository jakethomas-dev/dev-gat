"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<Props> = ({ open, onClose }) => {
  const [confirm, setConfirm] = useState("");
  const [ack, setAck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const required = "DELETE ACCOUNT";
  const canDelete = ack && confirm.trim().toUpperCase() === required;
  const handleDelete = async () => {
    if (!canDelete || loading) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/settings/deleteAccount', { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to delete account');
      }
      onClose();
      router.push('/signIn');
    } catch (e: any) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title="Delete account" size="md" footer={
      <div className="flex justify-end gap-2">
        <button className="px-3 py-1.5 border border-black rounded-sm bg-white hover:cursor-pointer hover:shadow-lg transition duration-150 disabled:opacity-50" disabled={loading} onClick={onClose}>Cancel</button>
        <button disabled={!canDelete || loading} className={`px-3 py-1.5 border border-black rounded-sm ${canDelete ? 'bg-red-600 text-white' : 'bg-red-200 text-red-700'} hover:cursor-pointer hover:shadow-lg transition duration-150 disabled:opacity-50`} onClick={handleDelete}>{loading ? 'Deleting…' : 'Delete account'}</button>
      </div>
    }>
      <div className="space-y-3">
        <p className="text-sm text-black/80">This permanently removes your account and all associated data. Type <span className="font-semibold">{required}</span> and confirm the checkbox.</p>
        <input value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full border border-black rounded-sm px-3 py-2 focus:outline-none focus:shadow-md transition duration-150" placeholder={required} />
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
          I understand this action cannot be undone.
        </label>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;
