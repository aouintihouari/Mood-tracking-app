import CheckIn from "../models/CheckIn.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const createCheckIn = catchAsync(async (req, res, next) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  const newCheckIn = await CheckIn.create({
    ...req.body,
    user: req.user.id,
    checkInDate: date,
  });

  res.status(201).json({ status: "success", data: { checkIn: newCheckIn } });
});
