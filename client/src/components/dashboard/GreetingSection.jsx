const GreetingSection = ({ user }) => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const firstName = user?.name ? user.name.split(" ")[0] : "Friend";

  return (
    <div className="mb-2 flex flex-col items-center gap-1 text-center md:gap-2">
      <h1 className="text-preset-[24px] md:text-preset-3 font-bold text-blue-600">
        Hello, {firstName}!
      </h1>
      <h2 className="md:text-preset-1 text-preset-1-mob font-bold text-neutral-900">
        How are you feeling today?
      </h2>
      <p className="text-preset-6-regular mt-2 text-neutral-600">{today}</p>
    </div>
  );
};

export default GreetingSection;
