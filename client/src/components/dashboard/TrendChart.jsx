import { useMemo } from "react";
import { getMoodConfig } from "../../utils/moodConstants";
import sleepIcon from "/images/icon-sleep.svg";

const TrendChart = ({ data }) => {
  const yLabels = [
    "9+ hours",
    "7-8 hours",
    "5-6 hours",
    "3-4 hours",
    "0-2 hours",
  ];

  const chartData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];

      const dayData = data.find((item) => {
        const itemDate = new Date(item.checkInDate).toISOString().split("T")[0];
        return itemDate === dateKey;
      });

      days.push({
        dateObj: d,
        dayLabel: d.toLocaleDateString("en-US", { weekday: "short" }),
        dateNumber: d.getDate(),
        data: dayData || null,
      });
    }
    return days;
  }, [data]);

  const getBarHeight = (sleepScore) => {
    if (!sleepScore) return "0%";
    if (sleepScore >= 9) return "100%";
    if (sleepScore >= 7) return "75%";
    if (sleepScore >= 5) return "50%";
    if (sleepScore >= 3) return "25%";
    return "10%";
  };

  return (
    <div className="bg-neutral-0 rounded-24 flex h-full w-full flex-col p-6 shadow-sm ring-1 ring-neutral-200/30 md:p-8">
      <h3 className="text-preset-4 mb-8 text-neutral-900">
        Mood and sleep trends
      </h3>

      {/* Conteneur principal du graphique */}
      <div className="relative flex w-full flex-1 overflow-hidden">
        {/* COLONNE AXE Y (FIXE) */}
        <div className="bg-neutral-0 z-20 flex flex-col justify-between py-3 pr-4 text-right">
          {yLabels.map((label) => (
            <span
              key={label}
              className="text-preset-9 flex h-6 items-center gap-2 whitespace-nowrap text-neutral-600"
            >
              <img src={sleepIcon} alt="Sleep" className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.split(" ")[0]}</span>
            </span>
          ))}
          {/* Espaceur pour aligner avec l'axe X en bas */}
          <div className="mt-4 h-10"></div>
        </div>

        {/* ZONE SCROLLABLE (GRILLE + BARRES + AXE X) */}
        <div className="no-scrollbar flex-1 overflow-x-auto scroll-smooth">
          {/* Largeur minimale sur mobile pour forcer le scroll, auto sur desktop */}
          <div className="relative flex h-full min-w-[500px] flex-col md:min-w-full">
            {/* GRILLE ET BARRES */}
            <div className="relative flex-1">
              {/* Lignes de la grille (Background) */}
              <div className="absolute inset-0 z-0 flex flex-col justify-between py-3">
                {yLabels.map((_, i) => (
                  <div
                    key={i}
                    className="h-px w-full bg-neutral-100 last:bg-transparent"
                  ></div>
                ))}
              </div>

              <div className="relative z-10 grid h-full w-full grid-cols-7 items-end gap-3 px-2 sm:gap-4">
                {chartData.map((day, index) => {
                  const hasData = !!day.data;
                  const moodScore = hasData
                    ? Math.round(day.data.moodScore)
                    : 3;
                  const sleepScore = hasData ? day.data.sleepScore : null;

                  const config = getMoodConfig(moodScore);
                  const barClass = hasData ? config.bgClass : "bg-transparent";
                  const height = hasData ? getBarHeight(sleepScore) : "0px";

                  return (
                    <div
                      key={index}
                      className="group flex h-full flex-col justify-end"
                    >
                      {hasData && (
                        <div className="relative flex h-full w-full flex-col items-center justify-end">
                          <div
                            style={{ height }}
                            className={`w-full max-w-15 rounded-full ${barClass} relative flex justify-center transition-all duration-500 ease-out group-hover:opacity-90`}
                          >
                            <div className="absolute top-1 h-8 w-8 p-1 transition-transform group-hover:scale-110 md:h-10 md:w-10">
                              <img
                                src={config.iconWhite}
                                alt={config.label}
                                className="h-full w-full object-contain"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid h-10 w-full grid-cols-7 gap-3 px-2 sm:gap-4">
              {chartData.map((day, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1 text-center"
                >
                  <span className="text-preset-9 text-neutral-600 uppercase">
                    {day.dayLabel}
                  </span>
                  <span
                    className={`text-preset-8 ${
                      day.data
                        ? "font-bold text-neutral-900"
                        : "text-neutral-400"
                    }`}
                  >
                    {day.dateNumber}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
