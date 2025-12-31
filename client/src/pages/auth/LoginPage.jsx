import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import api from "../../api/axios";
import errorIcon from "/images/error-icon.svg";

const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      navigate("/dashboard", { state: { user: response.data.data.user } });
    } catch (err) {
      console.error("Error Login:", err);
      const message =
        err.response?.data?.message || "Invalid email or password";
      setServerError(message);
    }
  };

  return (
    <div className="flex flex-col gap-400">
      <div className="text-left">
        <h2 className="text-preset-4 md:text-preset-3 mb-100 font-bold text-neutral-900">
          Welcome back!
        </h2>
        <p className="text-preset-7 md:text-preset-6-regular text-neutral-600">
          Log in to continue tracking your mood and sleep.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-150"
        noValidate
      >
        <div className="flex flex-col gap-150">
          <label
            htmlFor="email"
            className="text-preset-7 md:text-preset-6-regular font-medium text-neutral-900"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            placeholder="name@mail.com"
            {...register("email")}
            className={`rounded-10 text-preset-7 md:text-preset-6 h-12.25 w-full border px-200 py-150 transition-colors focus:outline-none ${
              errors.email || serverError
                ? "border-red-700 text-red-700 placeholder:text-red-700/50 focus:border-red-700"
                : "border-neutral-300 text-neutral-900 placeholder:text-neutral-600 focus:border-blue-600"
            }`}
          />
          {errors.email && (
            <div className="flex items-center gap-100 overflow-hidden text-red-700">
              <img src={errorIcon} alt="Error icon" />
              <span className="text-preset-9 md:text-preset-8 truncate font-medium">
                {errors.email.message}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-100">
          <label
            htmlFor="password"
            className="text-preset-7 md:text-preset-6-regular font-medium text-neutral-900"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className={`rounded-10 text-preset-7 md:text-preset-6 h-12.25 w-full border px-200 py-150 transition-colors focus:outline-none ${
              errors.password || serverError
                ? "border-red-700 text-red-700 placeholder:text-red-700/50 focus:border-red-700"
                : "border-neutral-300 text-neutral-900 placeholder:text-neutral-600 focus:border-blue-600"
            }`}
          />
          {errors.password && (
            <div className="flex items-center gap-100 overflow-hidden text-red-700">
              <img src={errorIcon} alt="Error icon" />
              <span className="text-preset-9 md:text-preset-8 truncate font-medium">
                {errors.password.message}
              </span>
            </div>
          )}
        </div>

        {serverError && (
          <div className="flex items-center gap-100 overflow-hidden text-red-700">
            <img src={errorIcon} alt="Error icon" />
            <span className="text-preset-9 md:text-preset-8 truncate font-medium">
              {serverError}
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`text-preset-6 md:text-preset-5 text-neutral-0 rounded-10 mt-200 w-full cursor-pointer bg-blue-600 px-[32px] py-[12px] transition-colors hover:bg-blue-700 ${
            isSubmitting ? "cursor-not-allowed opacity-70" : ""
          }`}
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="text-preset-7 md:text-preset-6-regular text-center text-neutral-600">
        Haven't got an account?{" "}
        <Link
          to="/sign-up"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign up.
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
