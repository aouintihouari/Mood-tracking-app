const EmptyTrendChart = () => {
  const yLabels = [
    "9+ hours",
    "7-8 hours",
    "5-6 hours",
    "3-4 hours",
    "0-2 hours",
  ];

  const xLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }), // "Mon"
      date: d.getDate(), // "16"
    };
  });

  return (
    <div className="bg-neutral-0 rounded-24 flex h-full min-h-[400px] w-full flex-col p-8 shadow-sm ring-1 ring-neutral-200/30">
      <h3 className="text-preset-4 mb-8 text-neutral-900">
        Mood and sleep trends
      </h3>

      <div className="relative flex w-full flex-1">
        {/* AXE Y (Labels à gauche) */}
        <div className="flex flex-col justify-between py-3 pr-6 text-right">
          {yLabels.map((label) => (
            <span
              key={label}
              className="text-preset-9 whitespace-nowrap text-neutral-600"
            >
              {label}
            </span>
          ))}
        </div>

        {/* GRILLE (Lignes horizontales) */}
        <div className="flex w-full flex-1 flex-col justify-between py-3">
          {yLabels.map((_, i) => (
            <div
              key={i}
              className="h-px w-full bg-neutral-100 last:bg-transparent"
            ></div>
          ))}
        </div>
      </div>

      {/* AXE X (Dates en bas) */}
      <div className="mt-4 flex w-full justify-between pl-[80px]">
        {xLabels.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-preset-9 text-neutral-600">{item.day}</span>
            <span className="text-preset-8 text-neutral-900">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmptyTrendChart;
