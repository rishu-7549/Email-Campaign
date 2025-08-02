import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  nodes: { type: Array, required: true },
  edges: { type: Array, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userEmail: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Campaign", campaignSchema);
