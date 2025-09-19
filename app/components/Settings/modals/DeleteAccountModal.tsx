"use client";
import React, { useState } from "react";
import Modal from "@/app/components/ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<Props> = ({ open, onClose }) => {
  const [confirm, setConfirm] = useState("");
  const [ack, setAck] = useState(false);
  const required = "DELETE ACCOUNT";
  const canDelete = ack && confirm.trim().toUpperCase() === required;
  return (
    <Modal open={open} onClose={onClose} title="Delete account" size="md" footer={
      <div className="flex justify-end gap-2">
        <button className="px-3 py-1.5 border border-black rounded-sm bg-white hover:cursor-pointer hover:shadow-lg transition duration-150" onClick={onClose}>Cancel</button>
        <button disabled={!canDelete} className={`px-3 py-1.5 border border-black rounded-sm  ${canDelete ? "bg-red-600 text-white" : "bg-red-200 text-red-700 hover:cursor-pointer hover:shadow-lg transition duration-150"}`} onClick={onClose}>Delete account</button>
      </div>
    }>
      <div className="space-y-3">
        <p className="text-sm text-black/80">This permanently removes your account and all associated data. Type <span className="font-semibold">{required}</span> and confirm the checkbox.</p>
        <input value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full border border-black rounded-sm px-3 py-2 focus:outline-none focus:shadow-md transition duration-150" placeholder={required} />
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
          I understand this action cannot be undone.
        </label>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;
