import { Schema, model, models } from "mongoose";


const applicationSchema = new Schema({
  applicationName: { type: String, required: true },
  siteLocation: { type: String, required: true },
  applicationType: { type: String, required: true },
  proposal: { type: String, required: true },
  statusOf: {
    type: String,
    enum: ["Draft", "Submitted", "Approved", "Rejected"],
    default: "Submitted",
  },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },

  // Progress-related fields
  siteBoundary: { type: Schema.Types.Mixed, default: null }, // GeoJSON or file ref
  actionPlan: { type: Schema.Types.Mixed, default: null }, // Action plan file or object
  applicationQuestions: { type: [Boolean], default: Array(12).fill(false) }, // 12 questions, true if answered
  plansAndDocuments: {
    type: [
      {
        name: { type: String, required: true },
        uploaded: { type: Boolean, default: false },
        required: { type: Boolean, default: true },
      },
    ],
    default: [],
  }, // 3+ requirements
  calculatedFee: { type: Number, default: null },

  // Progress weights (can be edited later)
  progressWeights: {
    siteBoundary: { type: Number, default: 0.2 },
    actionPlan: { type: Number, default: 0.2 },
    applicationQuestions: { type: Number, default: 0.3 },
    plansAndDocuments: { type: Number, default: 0.3 },
  },
});

export default models.Application || model("Application", applicationSchema);
