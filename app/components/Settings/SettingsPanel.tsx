"use client";
import React, { useState } from "react";
import Card from "@/app/components/Card";
import UpdateEmailModal from "./modals/UpdateEmailModal";
import EditPictureModal from "./modals/EditPictureModal";
import EditNameModal from "./modals/EditNameModal";
import ChangePasswordModal from "./modals/ChangePasswordModal";
import DeleteContentModal from "./modals/DeleteContentModal";
import DeleteAccountModal from "./modals/DeleteAccountModal";

const Button = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button onClick={onClick} className="px-3 py-1.5 border border-black rounded-sm bg-white hover:cursor-pointer hover:shadow-lg transition">
    {children}
  </button>
);

export default function SettingsPanel() {
  const [showEmail, setShowEmail] = useState(false);
  const [showPic, setShowPic] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showDelContent, setShowDelContent] = useState(false);
  const [showDelAccount, setShowDelAccount] = useState(false);

  return (
    <section className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <Card title="Profile" content="Update your profile and preferences." />
          <div className="border border-black rounded-sm p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Update email</h4>
                <p className="text-sm text-black/60">Change the email associated with your account.</p>
              </div>
              <Button onClick={() => setShowEmail(true)}>Update</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Edit picture</h4>
                <p className="text-sm text-black/60">Upload a new profile image.</p>
              </div>
              <Button onClick={() => setShowPic(true)}>Edit</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Edit name</h4>
                <p className="text-sm text-black/60">Update your first and last name.</p>
              </div>
              <Button onClick={() => setShowName(true)}>Edit</Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card title="Security" content="Manage security settings." />
          <div className="border border-black rounded-sm p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Change password</h4>
                <p className="text-sm text-black/60">Choose a strong, unique password.</p>
              </div>
              <Button onClick={() => setShowPwd(true)}>Change</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Delete content</h4>
                <p className="text-sm text-black/60">Remove your posted content. This cannot be undone.</p>
              </div>
              <Button onClick={() => setShowDelContent(true)}>Delete</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Delete account</h4>
                <p className="text-sm text-black/60">Permanently delete your account and all data.</p>
              </div>
              <Button onClick={() => setShowDelAccount(true)}>Delete</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UpdateEmailModal open={showEmail} onClose={() => setShowEmail(false)} />
      <EditPictureModal open={showPic} onClose={() => setShowPic(false)} />
      <EditNameModal open={showName} onClose={() => setShowName(false)} />
      <ChangePasswordModal open={showPwd} onClose={() => setShowPwd(false)} />
      <DeleteContentModal open={showDelContent} onClose={() => setShowDelContent(false)} />
      <DeleteAccountModal open={showDelAccount} onClose={() => setShowDelAccount(false)} />
    </section>
  );
}
