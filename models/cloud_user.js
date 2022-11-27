const { Schema, model } = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const d = new Date();
console.log(d);
const date = moment().format("dddd, MMMM Do YYYY");
const time = moment().format("h:mm:ss a");
console.log(date);
console.log(time);

// const mongoose = require("mongoose");
// const validator = require("validator");

const userSchema = Schema(
	{
		// name: String,
		// displayname:String,
		// email: String,
		// quota: String,
		// password: String,
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
		quota: {
			type: String,
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

		// name:{
		//     type:String,
		//      required:true,
		//     minLength:3
		// },
		// email:{
		//     type:String,
		//      required:true,
		//     validate(value){
		//         if(!validator.isEmail(value)){
		//             throw new Error("Invalid email id");
		//         }
		//     }
		// }
		// quota:{
		//     type:String,
		//     required:true

		// }
		// message:{
		//     type:String,
		//     required:true,
		//     minLength:3
		// }
	},
	{ timestamps: true }
);

// collection
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

const validatecloudUser = (user) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(100),
		email: Joi.string().min(5).max(255).required(),
		password: Joi.string().min(5).max(255).required(),
	});
	return schema.validate(user);
};

module.exports.CloudUser = model("CloudUser", userSchema);
module.exports.validate = validatecloudUser;
// const CloudUser = mongoose.model("CloudUser", userSchema);
// module.exports = CloudUser;
