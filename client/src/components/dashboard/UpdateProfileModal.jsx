import { useEffect, useState } from "react";
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

const UpdateProfileModal = ({ isOpen, onClose, user, onUpdateSuccess }) => {
  const [serverError, setServerError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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
    if (isOpen && user) {
      reset({ name: user.name });
      setPreviewUrl(user.photo || null);
    }
  }, [isOpen, user, reset]);

  useEffect(() => {
    register("photo");
  }, [register]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setValue("photo", file, { shouldDirty: true });
    }
  };

  const onSubmit = async (data) => {
    setServerError(null);
    const photoToUpload = getValues("photo");

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (photoToUpload instanceof File) {
        formData.append("photo", photoToUpload);
      }

      await api.patch("/users/updateMe", formData);
      onUpdateSuccess();
      onClose();
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-sm">
      <div className="rounded-24 animate-in fade-in zoom-in relative w-full max-w-[540px] bg-white p-8 shadow-xl duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 cursor-pointer text-neutral-500 hover:text-neutral-900"
        >
          ✕
        </button>

        <div className="mb-8">
          <h2 className="text-preset-3 mb-2 font-bold text-neutral-900">
            Update your profile
          </h2>
          <p className="text-preset-6-regular text-neutral-600">
            Personalize your account with your name and photo.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-preset-6 font-medium text-neutral-900"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className={`rounded-10 text-preset-6 h-12 w-full border px-4 transition-colors focus:outline-none ${
                errors.name
                  ? "border-red-700"
                  : "border-neutral-300 focus:border-blue-600"
              }`}
            />
            {errors.name && (
              <div className="flex items-center gap-2 text-red-700">
                <img src={errorIcon} alt="Error" />
                <span className="text-preset-8 font-medium">
                  {errors.name.message}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 py-2">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-neutral-100 bg-neutral-200">
              <img
                src={previewUrl || avatarIcon}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-preset-6 font-medium text-neutral-900">
                Upload Image
              </h3>
              <p className="text-preset-8 mb-2 text-neutral-600">
                Max 5MB, PNG or JPEG
              </p>
              <label
                htmlFor="photo-modal"
                className="text-preset-7 rounded-10 bg-neutral-0 w-fit cursor-pointer border border-neutral-300 px-4 py-2 text-neutral-900 transition-colors hover:bg-neutral-100"
              >
                Upload
              </label>
              <input
                type="file"
                id="photo-modal"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {serverError && (
            <p className="text-preset-8 text-red-700">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="text-preset-5 text-neutral-0 rounded-16 mt-4 w-full cursor-pointer bg-blue-600 py-4 font-bold shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
