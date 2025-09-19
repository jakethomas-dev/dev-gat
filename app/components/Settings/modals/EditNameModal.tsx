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
  return (
    <Modal open={open} onClose={onClose} title="Edit name" size="md" footer={
      <div className="flex justify-end gap-2">
        <button className="px-3 py-1.5 border border-black rounded-sm bg-white hover:cursor-pointer hover:shadow-lg transition duration-150" onClick={onClose}>Cancel</button>
        <button className="px-3 py-1.5 border border-black rounded-sm bg-black text-white hover:cursor-pointer hover:shadow-lg transition duration-150" onClick={onClose}>Save</button>
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
      </div>
    </Modal>
  );
};

export default EditNameModal;
