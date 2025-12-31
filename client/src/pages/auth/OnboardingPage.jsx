import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import api from "../../api/axios";
import avatarIcon from "/images/avatar-placeholder.svg";
import errorIcon from "/images/error-icon.svg";

const onboardingSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name must be under 30 characters"),
});

const OnboardingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    register("photo");
  }, [register]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (location.state?.user) {
        const { name, photo } = location.state.user;
        reset({ name: name || "" });
        setPreviewUrl(photo || null);
        setIsLoadingData(false);
        return;
      }

      try {
        const res = await api.get("/users/me");
        const { name, photo } = res.data.data.user;
        reset({ name: name || "" });
        setPreviewUrl(photo || null);
      } catch (err) {
        console.error("Error fetching user:", err);
        navigate("/login");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchUserData();
  }, [location.state, navigate, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));

      setValue("photo", file, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const onSubmit = async (data) => {
    setServerError(null);

    const photoToUpload = data.photo || getValues("photo");

    try {
      const formData = new FormData();
      formData.append("name", data.name);

      if (photoToUpload instanceof File)
        formData.append("photo", photoToUpload);

      for (let [key, value] of formData.entries()) {
        console.log(`🚀 Payload -> ${key}:`, value);
      }

      await api.patch("/users/updateMe", formData);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error Onboarding:", err);
      setServerError(err.response?.data?.message || "Something went wrong");
    }
  };

  if (isLoadingData) {
    return <div className="p-10 text-center">Loading your profile...</div>;
  }

  return (
    <div className="flex flex-col gap-400">
      <div className="text-left">
        <h2 className="text-preset-4 md:text-preset-3 mb-100 font-bold text-neutral-900">
          Personalize your experience
        </h2>
        <p className="text-preset-7 md:text-preset-6 text-neutral-600">
          Review your profile details below.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-300"
        noValidate
      >
        <div className="flex flex-col gap-100">
          <label
            htmlFor="name"
            className="text-preset-7 md:text-preset-6-regular font-medium text-neutral-900"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="e.g. Jane Appleseed"
            {...register("name")}
            className={`rounded-10 text-preset-7 md:text-preset-6 h-12.25 w-full border px-200 py-150 transition-colors focus:outline-none ${
              errors.name
                ? "border-red-700 text-red-700"
                : "border-neutral-300 text-neutral-900 focus:border-blue-600"
            }`}
          />
          {errors.name && (
            <div className="flex items-center gap-100 text-red-700">
              <img src={errorIcon} alt="Error" />
              <span className="text-preset-9 md:text-preset-8 font-medium">
                {errors.name.message}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-start gap-200">
          <div className="h-[64px] w-[64px] shrink-0 overflow-hidden rounded-full bg-neutral-200">
            <img
              src={previewUrl || avatarIcon}
              alt="Avatar preview"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-100">
            <h3 className="text-preset-7 md:text-preset-6 font-medium text-neutral-900">
              Upload Image
            </h3>
            <p className="text-preset-9 md:text-preset-8 text-neutral-600">
              Max 5MB, PNG or JPEG
            </p>

            <label
              htmlFor="photo-upload"
              className="text-preset-7 md:text-preset-6-regular rounded-10 bg-neutral-0 w-fit cursor-pointer border border-neutral-300 px-[20px] py-[10px] text-neutral-900 transition-colors hover:bg-neutral-100"
            >
              Upload New
            </label>
            <input
              type="file"
              id="photo-upload"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {serverError && (
          <div className="flex items-center gap-100 text-red-700">
            <img src={errorIcon} alt="Error" />
            <span className="text-preset-9 md:text-preset-8 font-medium">
              {serverError}
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`text-preset-6 md:text-preset-5 text-neutral-0 rounded-10 mt-100 w-full cursor-pointer bg-blue-600 px-[32px] py-[12px] transition-colors hover:bg-blue-700 ${
            isSubmitting ? "cursor-not-allowed opacity-70" : ""
          }`}
        >
          {isSubmitting ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
};

export default OnboardingPage;
