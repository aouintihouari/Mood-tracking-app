import mongoose from "mongoose";

const CheckInSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A check-in must belong to a user"],
    },
    mood: {
      type: String,
      required: [true, "A check-in must have a mood."],
      enum: ["Very Happy", "Happy", "Neutral", "Sad", "Very Sad"],
    },
    tags: {
      type: [String],
      validate: [(val) => val.length <= 3, "You can select up to 3 tags only."],
    },
    sleepHours: {
      type: String,
      required: [true, "A check-in must have sleep hours."],
      enum: ["9+ hours", "7-8 hours", "5-6 hours", "3-4 hours", "0-2 hours"],
    },
    reflection: {
      type: String,
      trim: true,
      maxlength: [150, "Reflection must be under 150 characters."],
    },
    checkInDate: {
      type: Date,
      required: [true, "A check-in must have a normalized date."],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CheckInSchema.index({ user: 1, checkInDate: 1 }, { unique: true });

export default mongoose.model("CheckIn", CheckInSchema);
