import mongoose from "mongoose";

const emailEventSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  recipient: String,
  eventType: String, // "opened", "clicked"
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("EmailEvent", emailEventSchema);
