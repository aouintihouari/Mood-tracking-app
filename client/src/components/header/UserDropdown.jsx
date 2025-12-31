import settingsIcon from "/images/icon-settings.svg";
import logoutIcon from "/images/icon-logout.svg";

const UserDropdown = ({ user, onLogout, onSettingsClick }) => {
  return (
    <div className="rounded-16 bg-neutral-0 animate-in fade-in slide-in-from-top-2 absolute top-14 right-0 z-50 w-64 overflow-hidden p-6 shadow-xl ring-1 ring-neutral-200/50 duration-200">
      <div className="mb-4 border-b border-neutral-100 pb-4">
        <p className="text-preset-5 truncate font-bold text-neutral-900">
          {user?.name}
        </p>
        <p className="text-preset-7 truncate text-neutral-600">{user?.email}</p>
      </div>

      <nav className="flex flex-col gap-1">
        <button
          onClick={onSettingsClick}
          className="rounded-8 group flex w-full cursor-pointer items-center gap-3 p-3 text-left transition-colors hover:bg-neutral-100"
        >
          <img
            src={settingsIcon}
            alt=""
            className="h-5 w-5 opacity-70 group-hover:opacity-100"
          />
          <span className="text-preset-6 text-neutral-900">Settings</span>
        </button>

        <button
          onClick={onLogout}
          className="rounded-8 group flex w-full cursor-pointer items-center gap-3 p-3 text-left transition-colors hover:bg-red-50"
        >
          <img
            src={logoutIcon}
            alt=""
            className="h-5 w-5 opacity-70 group-hover:opacity-100"
          />
          <span className="text-preset-6 text-neutral-900 group-hover:text-red-700">
            Logout
          </span>
        </button>
      </nav>
    </div>
  );
};

export default UserDropdown;
