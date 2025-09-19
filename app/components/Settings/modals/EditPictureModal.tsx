"use client";
import React, { useRef, useState } from "react";
import Modal from "@/app/components/ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
}

const EditPictureModal: React.FC<Props> = ({ open, onClose }) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return setPreview(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  return (
    <Modal open={open} onClose={onClose} title="Update profile picture" size="sm" footer={
      <div className="flex justify-end gap-2">
        <button className="px-3 py-1.5 border border-black rounded-sm bg-white hover:cursor-pointer hover:shadow-lg transition duration-150" onClick={onClose}>Cancel</button>
        <button className="px-3 py-1.5 border border-black rounded-sm bg-black text-white hover:cursor-pointer hover:shadow-lg transition duration-150" onClick={onClose}>Save</button>
      </div>
    }>
      <div className="space-y-3">
        {preview ? (
          <img src={preview} alt="Preview" className="w-24 h-24 rounded-full object-cover border border-black" />
        ) : (
          <div className="w-24 h-24 rounded-full border border-dashed border-black/50 grid place-items-center text-xs text-black/60">No image</div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={onSelect} className="block" />
      </div>
    </Modal>
  );
};

export default EditPictureModal;
