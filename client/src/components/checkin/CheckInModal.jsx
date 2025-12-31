import { useState } from "react";
import { useForm, useWatch } from "react-hook-form"; // 1. Import de useWatch
import { zodResolver } from "@hookform/resolvers/zod";

// Icons
import veryHappyIcon from "/images/icon-very-happy-color.svg";
import happyIcon from "/images/icon-happy-color.svg";
import neutralIcon from "/images/icon-neutral-color.svg";
import sadIcon from "/images/icon-sad-color.svg";
import verySadIcon from "/images/icon-very-sad-color.svg";
// Assure-toi d'avoir une icône pour fermer, sinon remplace l'img par "✕"
// import closeIcon from "/images/icon-close.svg";

// Logique & API
import { checkInSchema } from "../../schemas/checkInSchema";
import api from "../../api/axios";

// --- DONNÉES STATIQUES ---
const MOOD_OPTIONS = [
  { label: "Very Happy", icon: veryHappyIcon },
  { label: "Happy", icon: happyIcon },
  { label: "Neutral", icon: neutralIcon },
  { label: "Sad", icon: sadIcon },
  { label: "Very Sad", icon: verySadIcon },
];

const SLEEP_OPTIONS = [
  "9+ hours",
  "7-8 hours",
  "5-6 hours",
  "3-4 hours",
  "0-2 hours",
];

const TAG_OPTIONS = [
  "Joyful",
  "Down",
  "Anxious",
  "Calm",
  "Excited",
  "Frustrated",
  "Lonely",
  "Grateful",
  "Overwhelmed",
  "Motivated",
  "Irritable",
  "Peaceful",
  "Tired",
  "Hopeful",
  "Confident",
  "Stressed",
  "Content",
  "Disappointed",
  "Optimistic",
  "Restless",
];

const CheckInModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    control, // 2. Indispensable pour useWatch
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      tags: [],
      mood: undefined,
      sleepHours: undefined,
    },
    mode: "onChange",
  });

  // 3. Utilisation de useWatch au lieu de watch()
  // Cela permet de suivre les changements sans provoquer de re-rendus globaux excessifs
  const currentMood = useWatch({ control, name: "mood" });
  const currentTags = useWatch({ control, name: "tags" }) || [];
  const currentSleep = useWatch({ control, name: "sleepHours" });
  const currentReflection = useWatch({ control, name: "reflection" }) || "";

  // Navigation
  const nextStep = async () => {
    let isValid = false;
    // On force la validation du champ courant
    if (step === 1) isValid = await trigger("mood");
    if (step === 2) isValid = await trigger("tags");
    if (step === 3) isValid = await trigger("sleepHours");

    if (isValid) {
      setStep((prev) => prev + 1);
    } else {
      console.log("Validation échouée :", errors); // Pour le debug
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  // Gestion des tags (limite max 3)
  const toggleTag = (tag) => {
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag) // Retirer
      : [...currentTags, tag]; // Ajouter

    if (newTags.length <= 3) {
      setValue("tags", newTags, { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    try {
      await api.post("/users/checkIn", data);
      onSuccess(); // Rafraîchir le dashboard
      onClose(); // Fermer le modal
    } catch (err) {
      setServerError(err.response?.data?.message || "Error saving check-in");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-[600px] flex-col gap-6 overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-preset-3 font-bold text-neutral-900">
            Log your mood
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="rounded-full p-2 transition-colors hover:bg-neutral-100"
          >
            <span className="text-xl font-bold text-neutral-500">✕</span>
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-blue-600" : "bg-neutral-200"}`}
            ></div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* --- STEP 1: MOOD --- */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <h3 className="text-preset-4 font-bold text-neutral-900">
                How was your mood today?
              </h3>

              <div className="flex flex-col gap-3">
                {MOOD_OPTIONS.map((option) => (
                  <label
                    key={option.label}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-all ${
                      currentMood === option.label
                        ? "border-blue-600 bg-blue-50/50"
                        : "border-neutral-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Radio Visuel */}
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          currentMood === option.label
                            ? "border-blue-600"
                            : "border-neutral-300"
                        }`}
                      >
                        {currentMood === option.label && (
                          <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <span
                        className={`text-preset-5 font-medium ${currentMood === option.label ? "text-neutral-900" : "text-neutral-700"}`}
                      >
                        {option.label}
                      </span>
                    </div>
                    <img
                      src={option.icon}
                      alt={option.label}
                      className="h-8 w-8"
                    />

                    {/* Input caché */}
                    <input
                      type="radio"
                      value={option.label}
                      {...register("mood")}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
              {/* Message d'erreur visible */}
              {errors.mood && (
                <p className="text-sm font-medium text-red-500">
                  {errors.mood.message}
                </p>
              )}
            </div>
          )}

          {/* --- STEP 2: TAGS --- */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-preset-4 font-bold text-neutral-900">
                  How did you feel?
                </h3>
                <p className="text-preset-6 mt-1 text-neutral-600">
                  Select up to three tags:
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {TAG_OPTIONS.map((tag) => {
                  const isSelected = currentTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-preset-6 flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      {isSelected && <span>✓</span>}
                      {tag}
                    </button>
                  );
                })}
              </div>
              {/* Input caché pour Zod */}
              <input type="hidden" {...register("tags")} />
              {errors.tags && (
                <p className="mt-2 text-sm font-medium text-red-500">
                  {errors.tags.message}
                </p>
              )}
            </div>
          )}

          {/* --- STEP 3: SLEEP --- */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <h3 className="text-preset-4 font-bold text-neutral-900">
                How many hours did you sleep last night?
              </h3>
              <div className="flex flex-col gap-3">
                {SLEEP_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center rounded-xl border-2 p-4 transition-all ${
                      currentSleep === option
                        ? "border-blue-600 bg-blue-50/50"
                        : "border-neutral-200 hover:border-blue-300"
                    }`}
                  >
                    <div
                      className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        currentSleep === option
                          ? "border-blue-600"
                          : "border-neutral-300"
                      }`}
                    >
                      {currentSleep === option && (
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <span className="text-preset-5 font-medium text-neutral-900">
                      {option}
                    </span>
                    <input
                      type="radio"
                      value={option}
                      {...register("sleepHours")}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
              {errors.sleepHours && (
                <p className="text-sm font-medium text-red-500">
                  {errors.sleepHours.message}
                </p>
              )}
            </div>
          )}

          {/* --- STEP 4: REFLECTION --- */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-preset-4 font-bold text-neutral-900">
                  Write about your day...
                </h3>
              </div>

              <div className="relative">
                <textarea
                  {...register("reflection")}
                  placeholder="Today, I felt..."
                  maxLength={150}
                  className="text-preset-5 h-40 w-full resize-none rounded-xl border border-neutral-300 p-4 text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none"
                ></textarea>
                <div className="text-preset-7 absolute right-4 bottom-4 text-neutral-500">
                  {currentReflection.length}/150
                </div>
              </div>
              {errors.reflection && (
                <p className="text-sm font-medium text-red-500">
                  {errors.reflection.message}
                </p>
              )}
            </div>
          )}

          {/* SERVER ERROR */}
          {serverError && (
            <p className="rounded bg-red-50 p-2 text-center font-medium text-red-500">
              {serverError}
            </p>
          )}

          {/* FOOTER BUTTONS */}
          <div className="mt-2 flex items-center">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 font-medium text-neutral-500 transition-colors hover:text-neutral-900"
              >
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto w-full rounded-xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700 md:w-auto"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-auto w-full rounded-xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
              >
                {isSubmitting ? "Saving..." : "Submit"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckInModal;
