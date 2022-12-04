const { Schema, model } = require("mongoose");

const Joi = require("joi");
const jwt = require("jsonwebtoken");
// const passwordComplexity = require("joi-password-complexity");
const moment = require("moment");

const d = new Date();

console.log(d);

const date = moment().format("dddd, MMMM Do YYYY");
const time = moment().format("h:mm:ss a");
console.log(date);
console.log(time);

const userSchema = Schema(
	{
		name: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 255,
		},
		email: {
			type: String,
			required: true,
			minlength: 5,
			maxlength: 255,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 5,
			maxlength: 1024,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		verified: { type: Boolean, default: false },
		otp: {
			type: String,
		},
	},
	{ timestamps: true }
);

userSchema.methods.generateJWT = function () {
	const token = jwt.sign(
		{
			_id: this._id,
			email: this.email,
			role: this.role,
			name: this.name,
		},
		process.env.JWT_SECRET_KEY,
		{ expiresIn: "7d" }
	);

	return token;
};

const validateUser = (user) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(100),
		email: Joi.string().min(5).max(255).required(),
		password: Joi.string().min(5).max(255).required(),
	});
	return schema.validate(user);
};

module.exports.User = model("User", userSchema);
module.exports.validate = validateUser;
