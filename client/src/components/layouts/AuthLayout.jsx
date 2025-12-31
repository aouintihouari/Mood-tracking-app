import { Outlet } from "react-router";

import logo from "/images/logo.svg";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-(image:--image-light-gradient) p-200 sm:p-200">
      <header className="mb-500 flex items-center gap-150">
        <div>
          <img className="w-40 md:w-44.25" src={logo} alt="logo" />
        </div>
      </header>
      <main className="bg-neutral-0 rounded-16 h-auto w-auto p-500 px-[16px] py-[40px] shadow-lg md:px-[32px]">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
