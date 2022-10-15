const { string } = require("joi");
const Joi = require("joi");

const login = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  password: Joi.string().min(6).max(30).required(),
  device: Joi.string().min(3).max(30).required(),
});

const mobile = Joi.object({
  mobile: Joi.string().min(11).max(20).required(),
});

const otp = Joi.object({
  mobile: Joi.string().min(11).max(20).required(),
  type: Joi.string().min(1).max(20).required(),
});

const otpVerify = Joi.object({
  mobile: Joi.string().min(11).max(20).required(),
  otp: Joi.string().min(6).max(10).required(),
});

const user = Joi.object({
  id: Joi.string().max(20).required(),
  referralId: Joi.string(),
  firstName: Joi.string().max(199),
  lastName: Joi.string().max(199),
  gender: Joi.string(),
  birthDate: Joi.string(),
  bloodGroup: Joi.string(),
  mobile: Joi.string().min(11).max(20).required(),
  email: Joi.string(),
  address: Joi.string().max(100),
  district: Joi.string().max(100),
  division: Joi.string().max(100),
  country: Joi.string().max(100),
  postCode: Joi.number().min(0),
  lat: Joi.number(),
  lng: Joi.number(),
  role: Joi.string().required(),
  walletPoint: Joi.number().min(0),
  profileComplete: Joi.boolean(),
  isEmailVerified: Joi.boolean(),
  profileImage: Joi.string(),
  newProfileImage: Joi.string(),
  isBlocked: Joi.boolean(),
});

module.exports = {
  login,
  user,
  otp,
  otpVerify,
  mobile,
};
