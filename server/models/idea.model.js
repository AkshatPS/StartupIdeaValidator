import mongoose from "mongoose";

const { Schema } = mongoose;

// --- Mongoose Schema for Ideas ---
const ideaSchema = new Schema({
  title: { type: String, required: true },
  pitch: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: String, required: true },
  audience: String,
  marketSize: String,
  competitors: String,
  businessModel: String,
  status: {
    type: String,
    default: "pending_analysis",
    enum: ["pending_analysis", "completed", "error"],
  },
  analysisResult: {
    type: Object,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Idea = mongoose.model("Idea", ideaSchema);

export default Idea;
