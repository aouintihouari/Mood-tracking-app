import multer from "multer";
import sharp from "sharp";
import User from "../models/User.js";
import CheckIn from "../models/CheckIn.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const calculateAvg = (arr, key) => {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((acc, curr) => acc + curr[key], 0) / arr.length;
};

const getTrend = (current, prev) => {
  if (!prev) return { direction: "flat", label: "Same as previous" };
  const diff = current - prev;
  if (Math.abs(diff) < 0.1)
    return { direction: "flat", label: "Same as previous" };
  return diff > 0
    ? { direction: "up", label: "Increase from previous" }
    : { direction: "down", label: "Decrease from previous" };
};

const multerStorage = multer.memoryStorage();
const multerFilter = (_, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("Not an image! Please upload only images.", 400), false);
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
export const uploadUserPhoto = upload.single("photo");

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const processedBuffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer();
  const result = await uploadToCloudinary(processedBuffer);
  req.file.cloudinaryUrl = result.secure_url;
  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password updates.", 400));
  }
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file?.cloudinaryUrl) filteredBody.photo = req.file.cloudinaryUrl;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ status: "success", data: { user: updatedUser } });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json(null);
});

export const getMe = (req, res) => {
  res.status(200).json({ status: "success", data: { user: req.user } });
};

export const getDashboardStats = catchAsync(async (req, res) => {
  const allStats = await CheckIn.aggregate([
    { $match: { user: req.user._id } },
    { $sort: { checkInDate: -1 } },
    { $limit: 10 },
    {
      $addFields: {
        moodScore: {
          $switch: {
            branches: [
              { case: { $eq: ["$mood", "Very Happy"] }, then: 5 },
              { case: { $eq: ["$mood", "Happy"] }, then: 4 },
              { case: { $eq: ["$mood", "Neutral"] }, then: 3 },
              { case: { $eq: ["$mood", "Sad"] }, then: 2 },
              { case: { $eq: ["$mood", "Very Sad"] }, then: 1 },
            ],
            default: 0,
          },
        },
        sleepScore: {
          $switch: {
            branches: [
              { case: { $eq: ["$sleepHours", "9+ hours"] }, then: 9 },
              { case: { $eq: ["$sleepHours", "7-8 hours"] }, then: 7.5 },
              { case: { $eq: ["$sleepHours", "5-6 hours"] }, then: 5.5 },
              { case: { $eq: ["$sleepHours", "3-4 hours"] }, then: 3.5 },
              { case: { $eq: ["$sleepHours", "0-2 hours"] }, then: 1 },
            ],
            default: 0,
          },
        },
      },
    },
  ]);

  const currentPeriod = allStats.slice(0, 5);
  const previousPeriod = allStats.slice(5, 10);

  const avgMoodCur = calculateAvg(currentPeriod, "moodScore");
  const avgMoodPrev = calculateAvg(previousPeriod, "moodScore");
  const avgSleepCur = calculateAvg(currentPeriod, "sleepScore");
  const avgSleepPrev = calculateAvg(previousPeriod, "sleepScore");

  const moodTrend = getTrend(avgMoodCur, avgMoodPrev);
  const sleepTrend = getTrend(avgSleepCur, avgSleepPrev);
  const chartStats = allStats.slice(0, 7).reverse();

  res.status(200).json({
    status: "success",
    data: {
      stats: chartStats,
      averages: {
        mood: { value: avgMoodCur, ...moodTrend },
        sleep: { value: avgSleepCur, ...sleepTrend },
      },
    },
  });
});
