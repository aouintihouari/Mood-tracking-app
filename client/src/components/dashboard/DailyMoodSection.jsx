import { getMoodConfig } from "../../utils/moodConstants";

import sleepIcon from "/images/icon-sleep.svg";
import reflectionIcon from "/images/icon-reflection.svg";

const DailyMoodSection = ({ todayData }) => {
  const moodScore = Math.round(todayData.moodScore);
  const sleepHours = todayData.sleepScore;
  const reflection = todayData.reflection || "No reflection added yet.";
  const tags = todayData.tags || "";

  const config = getMoodConfig(moodScore);

  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="bg-neutral-0 rounded-24 relative flex flex-col justify-between overflow-hidden p-8 shadow-sm ring-1 ring-neutral-200/30 lg:h-full">
        <div className="relative z-10 max-w-[60%]">
          <h3 className="text-preset-3 text-neutral-900">I’m feeling</h3>
          <h2 className="text-preset-1 mt-2 mb-6 leading-tight font-bold text-neutral-900">
            {config.label}
          </h2>

          <div className="mt-4">
            <span
              className={`block font-serif text-5xl leading-none ${config.colorClass}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  fill="currentColor"
                  d="M14.5 8c.813 0 1.5.688 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-4A1.48 1.48 0 0 1 9 13.5V6c0-2.75 2.219-5 5-5h.25a.76.76 0 0 1 .75.75v1.5a.74.74 0 0 1-.75.75H14c-1.125 0-2 .906-2 2v2h2.5Zm-9 0C6.313 8 7 8.688 7 9.5v4A1.5 1.5 0 0 1 5.5 15h-4A1.48 1.48 0 0 1 0 13.5V6c0-2.75 2.219-5 5-5h.25a.76.76 0 0 1 .75.75v1.5a.74.74 0 0 1-.75.75H5c-1.125 0-2 .906-2 2v2h2.5Z"
                />
              </svg>
            </span>
            <p className="text-preset-6-italic mt-2 pl-2 text-neutral-900">
              When your heart is full, share your light with the world.
            </p>
            <span
              className={`block rotate-180 pr-10 text-right font-serif text-5xl leading-none ${config.colorClass}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  fill="currentColor"
                  d="M14.5 8c.813 0 1.5.688 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-4A1.48 1.48 0 0 1 9 13.5V6c0-2.75 2.219-5 5-5h.25a.76.76 0 0 1 .75.75v1.5a.74.74 0 0 1-.75.75H14c-1.125 0-2 .906-2 2v2h2.5Zm-9 0C6.313 8 7 8.688 7 9.5v4A1.5 1.5 0 0 1 5.5 15h-4A1.48 1.48 0 0 1 0 13.5V6c0-2.75 2.219-5 5-5h.25a.76.76 0 0 1 .75.75v1.5a.74.74 0 0 1-.75.75H5c-1.125 0-2 .906-2 2v2h2.5Z"
                />
              </svg>{" "}
            </span>
          </div>
        </div>

        <div className="absolute top-1/2 -right-6 h-60 w-60 -translate-y-1/2 transform md:h-75 md:w-75 lg:-right-10 lg:h-80 lg:w-[320px]">
          <img
            src={config.icon}
            alt={config.label}
            className="h-full w-full object-contain drop-shadow-xl"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-neutral-0 rounded-24 flex flex-1 flex-col justify-center p-8 shadow-sm ring-1 ring-neutral-200/30">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-xl text-neutral-600">
              <img src={sleepIcon} alt="Sleep icon" />
            </span>
            <span className="text-preset-4 text-neutral-600">Sleep</span>
          </div>
          <p className="text-preset-1 font-bold text-neutral-900">
            {sleepHours >= 9 ? "9+ hours" : `${sleepHours} hours`}
          </p>
        </div>

        {/* Reflection Card */}
        <div className="bg-neutral-0 rounded-24 flex flex-1 flex-col justify-center p-8 shadow-sm ring-1 ring-neutral-200/30">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-xl text-neutral-600">
              <img src={reflectionIcon} alt="Reflection icon" />
            </span>
            <span className="text-preset-4 text-neutral-600">
              Reflection of the day
            </span>
          </div>
          <p className="text-preset-5 leading-relaxed text-neutral-900">
            {reflection}
          </p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-3">
            {tags.map((tag) => (
              <span key={tag} className="text-preset-7 text-neutral-400 italic">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyMoodSection;
