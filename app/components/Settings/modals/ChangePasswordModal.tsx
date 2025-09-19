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
  return (
    <Modal open={open} onClose={onClose} title="Change password" size="md" footer={
      <div className="flex justify-end gap-2">
        <button className="px-3 py-1.5 border border-black rounded-sm bg-white hover:cursor-pointer hover:shadow-lg transition duration-150" onClick={onClose}>Cancel</button>
        <button className="px-3 py-1.5 border border-black rounded-sm bg-black text-white hover:cursor-pointer hover:shadow-lg transition duration-150" onClick={onClose}>Save</button>
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
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
