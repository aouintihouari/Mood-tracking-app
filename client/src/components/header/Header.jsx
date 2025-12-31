import { useState } from "react";

import logo from "/images/logo.svg";
import dropDownIcon from "/images/icon-dropdown-arrow.svg";
import UserDropdown from "./UserDropdown";
import UpdateProfileModal from "../dashboard/UpdateProfileModal";
import api from "../../api/axios";

const Header = ({ user, onUpdateSuccess }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("isAuthenticated");
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="relative flex w-full items-center justify-between">
      <img src={logo} alt="Mood Tracker Logo" className="h-8 w-auto" />

      <div className="relative flex items-center gap-4">
        <div
          className="group flex cursor-pointer items-center gap-3"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {user?.photo && (
            <img
              className={`h-10 w-10 rounded-full border object-cover transition-all ${
                isDropdownOpen
                  ? "border-blue-600 ring-2 ring-blue-100"
                  : "border-neutral-200"
              }`}
              src={user.photo}
              alt={user.name}
            />
          )}
          <img
            src={dropDownIcon}
            alt="Dropdown"
            className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
          />
        </div>

        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />
            <UserDropdown
              user={user}
              onLogout={handleLogout}
              onSettingsClick={() => {
                setIsSettingsOpen(true);
                setIsDropdownOpen(false);
              }}
            />
          </>
        )}
      </div>

      <UpdateProfileModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onUpdateSuccess={onUpdateSuccess}
      />
    </header>
  );
};

export default Header;
