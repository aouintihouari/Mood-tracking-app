import patterIcon from "/images/bg-pattern-averages.svg";

const EmptyStateCard = ({ title, message, icon }) => {
  return (
    <div className="bg-neutral-0 rounded-24 flex h-full w-full flex-col gap-4 p-6 shadow-sm ring-1 ring-neutral-200/30">
      <h3 className="text-preset-4 text-neutral-900">
        {title}{" "}
        <span className="text-preset-7 ml-1 text-neutral-600">
          (Last 5 check-ins)
        </span>
      </h3>

      <div className="rounded-16 relative flex flex-1 flex-col justify-center overflow-hidden bg-blue-100 py-8 text-center">
        <div className="relative z-10 px-4">
          <h4 className="text-preset-4 mb-2 text-neutral-900">
            {icon === "chart" ? "Keep tracking!" : "Not enough data yet!"}
          </h4>
          <p className="text-preset-7 leading-relaxed text-neutral-600">
            {message}
          </p>
        </div>
        <img
          className="absolute top-0 -right-40"
          src={patterIcon}
          alt="pattern icon"
        />
      </div>
    </div>
  );
};

export default EmptyStateCard;
