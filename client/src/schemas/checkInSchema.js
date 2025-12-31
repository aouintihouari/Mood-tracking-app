import { z } from "zod";

export const checkInSchema = z.object({
  mood: z.enum(["Very Happy", "Happy", "Neutral", "Sad", "Very Sad"], {
    errorMap: () => ({ message: "Please select a mood to continue" }),
  }),
  tags: z
    .array(z.string())
    .min(1, "Please select at least one tag to describe your feeling")
    .max(3, "You can select up to 3 tags only"),
  sleepHours: z.enum(
    ["9+ hours", "7-8 hours", "5-6 hours", "3-4 hours", "0-2 hours"],
    { errorMap: () => ({ message: "Please select your sleep duration" }) },
  ),
  reflection: z
    .string()
    .trim()
    .min(1, "Please write a short reflection about your day")
    .max(150, "Reflection must be under 150 characters"),
});
