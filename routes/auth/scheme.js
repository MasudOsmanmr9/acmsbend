const {
    string
} = require('joi');
const Joi = require('joi');

const login = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    password: Joi.string().min(6).max(30).required(),
});

const mobile = Joi.object({
    mobile: Joi.string().min(11).max(20).required()
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
    firstName: Joi.string().max(199).required(),
    lastName: Joi.string().max(199).required(),
    mobile: Joi.string().min(11).max(20).required(),
    password: Joi.string().min(6).max(30).required(),
});


module.exports = {
    login,
    user,
    otp,
    otpVerify,
    mobile
}