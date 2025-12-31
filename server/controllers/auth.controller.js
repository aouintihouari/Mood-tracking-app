import crypto from "crypto";
import { z } from "zod";

import User from "../models/User.js";
import sendEmail from "../utils/email.js";
import AppError from "../utils/AppError.js";
import { createSendToken } from "../utils/createSendToken.js";
import catchAsync from "../utils/catchAsync.js";

const signupSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const signup = catchAsync(async (req, res, next) => {
  const validatedData = signupSchema.parse(req.body);

  const user = new User({ ...validatedData });
  const verificationToken = user.createEmailVerificationToken();

  await user.save({ validateBeforeSave: false });

  try {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const verificationURL = `${frontendUrl}/verify-email/${verificationToken}`;

    const html = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <h2 style="color: #111827; font-size: 24px; font-weight: bold; margin-bottom: 20px;">Verify your account</h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
            Welcome to <strong>Mood Tracker</strong>! We're excited to have you on board. 
            Please confirm your email address to start tracking your daily well-being.
          </p>

          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${verificationURL}" style="background-color: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
              Verify My Email
            </a>
          </div>

          <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px;">
            Or copy this link: <br/>
            <a href="${verificationURL}" style="color: #2563eb;">${verificationURL}</a>
          </p>
          
        </div>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: "Welcome to Mood Tracker! 🚀",
      message: `Please click here to verify your account: ${verificationURL}`, // Version texte brut
      html,
    });

    res.status(201).json({
      status: "success",
      message: "Verification email sent successfully!",
      data: { user },
    });
  } catch (err) {
    await User.findByIdAndDelete(user._id);
    return next(
      new AppError(
        "There was an error sending the email. Please try again later.",
        500
      )
    );
  }
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = loginSchema.parse(req.body);
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Incorrect email or password", 401));
  if (!user.isVerified)
    return next(new AppError("Please verify your email first.", 401));

  createSendToken(user, 200, res);
});

export const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};

export const verifyAccount = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Invalid or expired token", 400));

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;

  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json({ status: "success", message: "Account verified successfully" });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(new AppError("There is no user with that email address.", 404));
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Token is invalid or has expired", 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiresAt = undefined;

  await user.save();
  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError("Your current password is wrong", 401));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  createSendToken(user, 200, res);
});
