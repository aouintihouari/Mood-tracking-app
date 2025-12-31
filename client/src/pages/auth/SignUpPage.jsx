import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import api from "../../api/axios";
import errorIcon from "/images/error-icon.svg";

const signUpSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Must contain at least 1 lowercase")
      .regex(/[A-Z]/, "Must contain at least 1 uppercase")
      .regex(/[0-9]/, "Must contain at least 1 number")
      .regex(/[\W_]/, "Must contain at least 1 symbol"),
    passwordConfirm: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

const SignUpPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const response = await api.post("/auth/signup", {
        email: data.email,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      });
      navigate("/onboarding", { state: { user: response.data.data.user } });
    } catch (err) {
      console.error("Error Signup:", err);
      const message = err.response?.data?.message || "Something went wrong";
      setServerError(message);
    }
  };

  return (
    <div className="flex flex-col gap-400">
      <div className="text-left">
        <h2 className="text-preset-4 md:text-preset-3 mb-100 font-bold text-neutral-900">
          Create an account
        </h2>
        <p className="text-preset-7 md:text-preset-6-regular text-neutral-600">
          Join to track your daily mood and sleep with ease.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-100"
        noValidate
      >
        <div className="flex flex-col gap-100">
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
              errors.email
                ? "border-red-700 text-red-700 placeholder:text-red-700/50 focus:border-red-700"
                : "border-neutral-300 text-neutral-900 placeholder:text-neutral-600 focus:border-blue-600"
            }`}
          />
          {errors.email && (
            <div className="flex items-center gap-100 overflow-hidden text-red-700">
              <img src={errorIcon} alt="error-icon" />
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
              errors.password
                ? "border-red-700 text-red-700 placeholder:text-red-700/50 focus:border-red-700"
                : "border-neutral-300 text-neutral-900 placeholder:text-neutral-600 focus:border-blue-600"
            }`}
          />
          {errors.password && (
            <div className="flex items-center gap-100 overflow-hidden text-red-700">
              <img src={errorIcon} alt="error-icon" />
              <span className="text-preset-9 md:text-preset-8 truncate font-medium">
                {errors.password.message}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-100">
          <label
            htmlFor="passwordConfirm"
            className="text-preset-7 md:text-preset-6-regular font-medium text-neutral-900"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="passwordConfirm"
            {...register("passwordConfirm")}
            className={`rounded-10 text-preset-7 md:text-preset-6 h-12.25 w-full border px-200 py-150 transition-colors focus:outline-none ${
              errors.passwordConfirm
                ? "border-red-700 text-red-700 placeholder:text-red-700/50 focus:border-red-700"
                : "border-neutral-300 text-neutral-900 placeholder:text-neutral-600 focus:border-blue-600"
            }`}
          />
          {errors.passwordConfirm && (
            <div className="flex items-center gap-100 overflow-hidden text-red-700">
              <img src={errorIcon} alt="error-icon" />
              <span className="text-preset-9 md:text-preset-8 truncate font-medium">
                {errors.passwordConfirm.message}
              </span>
            </div>
          )}
        </div>

        {serverError && (
          <div className="flex items-center gap-100 overflow-hidden text-red-700">
            <img src={errorIcon} alt="error-icon" />
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
          {isSubmitting ? "Creating..." : "Sign Up"}
        </button>
      </form>

      <div className="text-preset-7 md:text-preset-6-regular text-center text-neutral-600">
        Already got an account?{" "}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          Log in.
        </Link>
      </div>
    </div>
  );
};

export default SignUpPage;
