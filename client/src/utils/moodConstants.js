// src/utils/moodConstants.js

// Imports existants (couleurs)
import veryHappyIcon from "/images/icon-very-happy-color.svg";
import happyIcon from "/images/icon-happy-color.svg";
import neutralIcon from "/images/icon-neutral-color.svg";
import sadIcon from "/images/icon-sad-color.svg";
import verySadIcon from "/images/icon-very-sad-color.svg";

// NOUVEAUX IMPORTS (White versions)
// Assure-toi que les fichiers existent bien dans ton dossier public/images/
import veryHappyWhite from "/images/icon-very-happy-white.svg";
import happyWhite from "/images/icon-happy-white.svg";
import neutralWhite from "/images/icon-neutral-white.svg";
import sadWhite from "/images/icon-sad-white.svg";
import verySadWhite from "/images/icon-very-sad-white.svg";

export const MOOD_CONFIG = {
  5: {
    label: "Very Happy",
    icon: veryHappyIcon,
    iconWhite: veryHappyWhite, // <--- Nouvelle propriété
    colorClass: "text-amber-300",
    bgClass: "bg-amber-300",
  },
  4: {
    label: "Happy",
    icon: happyIcon,
    iconWhite: happyWhite, // <--- Nouvelle propriété
    colorClass: "text-green-300",
    bgClass: "bg-green-300",
  },
  3: {
    label: "Neutral",
    icon: neutralIcon,
    iconWhite: neutralWhite, // <--- Nouvelle propriété
    colorClass: "text-blue-300",
    bgClass: "bg-blue-300",
  },
  2: {
    label: "Sad",
    icon: sadIcon,
    iconWhite: sadWhite, // <--- Nouvelle propriété
    colorClass: "text-indigo-200",
    bgClass: "bg-indigo-200",
  },
  1: {
    label: "Very Sad",
    icon: verySadIcon,
    iconWhite: verySadWhite, // <--- Nouvelle propriété
    colorClass: "text-red-300",
    bgClass: "bg-red-300",
  },
};

export const getMoodConfig = (score) => {
  const roundedScore = Math.round(score);
  return MOOD_CONFIG[roundedScore] || MOOD_CONFIG[3];
};
