import sleepIcon from "/images/icon-sleep.svg";
import { getMoodConfig } from "../../utils/moodConstants";
import patterIcon from "/images/bg-pattern-averages.svg";

// Fonction utilitaire pour récupérer l'icône de tendance
const getTrendIcon = (direction) => {
  if (direction === "up") return "↗";
  if (direction === "down") return "↘";
  return "→"; // "flat" ou default
};

const StatCard = ({
  type,
  averageValue,
  trendDirection = "flat", // "up", "down", ou "flat"
  trendLabel = "Same as previous period", // Texte par défaut
}) => {
  const trendIcon = getTrendIcon(trendDirection);

  // --- LOGIQUE MOOD ---
  if (type === "mood") {
    const moodConfig = getMoodConfig(averageValue);

    return (
      <div className="bg-neutral-0 rounded-24 flex h-full w-full flex-col gap-4 p-6 shadow-sm ring-1 ring-neutral-200/30">
        <h3 className="text-preset-4 text-neutral-900">
          Average Mood
          <span className="text-preset-7 ml-1 text-neutral-600">
            (Last 5 check-ins)
          </span>
        </h3>

        <div
          className={`rounded-24 relative flex flex-1 flex-col justify-center overflow-hidden p-6 ${moodConfig.bgClass}`}
        >
          {/* Blob décoratif */}
          <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/20 blur-xl"></div>

          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <img
                src={moodConfig.iconWhite || moodConfig.icon} // Fallback si iconWhite n'existe pas
                alt={moodConfig.label}
                className="h-8 w-8"
              />
              <span className="text-preset-3 font-bold text-neutral-900">
                {moodConfig.label}
              </span>
            </div>

            {/* Tendance Dynamique */}
            <div className="text-preset-6 mt-2 flex items-center gap-2 text-neutral-900/80">
              <span className="font-bold">{trendIcon}</span> {trendLabel}
            </div>
          </div>

          <img
            className="absolute top-0 -right-40 opacity-50"
            src={patterIcon}
            alt="pattern icon"
          />
        </div>
      </div>
    );
  }

  // --- LOGIQUE SLEEP ---
  let label = "0-2 Hours";
  // On s'assure que averageValue est un nombre pour éviter les bugs
  const val = Number(averageValue) || 0;

  if (val >= 9) label = "9+ Hours";
  else if (val >= 7) label = "7-8 Hours";
  else if (val >= 5) label = "5-6 Hours";
  else if (val >= 3) label = "3-4 Hours";

  return (
    <div className="bg-neutral-0 rounded-24 flex h-full w-full flex-col gap-4 p-6 shadow-sm ring-1 ring-neutral-200/30">
      <h3 className="text-preset-4 text-neutral-900">
        Average Sleep
        <span className="text-preset-7 ml-1 text-neutral-600">
          (Last 5 check-ins)
        </span>
      </h3>

      <div className="rounded-24 relative flex flex-1 flex-col justify-center overflow-hidden bg-blue-600 p-6 text-white">
        <div className="absolute -right-4 -bottom-4 h-32 w-32 rounded-full bg-blue-500/50 blur-2xl"></div>

        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <img
              src={sleepIcon}
              alt="Sleep"
              className="h-8 w-8 brightness-0 invert"
            />
            <span className="text-preset-3 font-bold">{label}</span>
          </div>

          {/* Tendance Dynamique */}
          <div className="text-preset-7 mt-2 flex items-center gap-2 text-blue-100">
            <span className="font-bold">{trendIcon}</span> {trendLabel}
          </div>
        </div>

        <img
          className="absolute top-0 -right-40 opacity-20"
          src={patterIcon}
          alt="pattern icon"
        />
      </div>
    </div>
  );
};

export default StatCard;
