// lib/models/Session.ts
import mongoose from "mongoose";
const SessionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  sessionToken: String,
  expiresAt: Date,
});

export const Session = mongoose.models.Session || mongoose.model("Session", SessionSchema);
