const bcrypt = require("bcrypt");
const _ = require("lodash");
const { cloudUser, validate } = require("../models/cloud_user");
// const axios = require("axios");
// const Token = require("../models/token");
// const crypto = require("crypto");
// const sendEmail = require("../utils/sendEmail");

module.exports.signUp = async (req, res) => {
	try {
		const { error } = validate(req.body);

		if (error) return res.status(400).send(error.details[0].message);

		let user = {};
		user = await cloudUser.findOne({
			email: req.body.email,
		});
		if (user) return res.status(400).send("User already registered");

		user = new cloudUser(
			_.pick(req.body, ["name", "email", "quota", "password"])
		);

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
		// user = await new User({ ...req.body, password: hashPassword }).save();
		const token = user.generateJWT();
		// const token = await new Token({
		// 	userId: user._id,
		// 	token: crypto.randomBytes(32).toString("hex"),
		// }).save();

		const result = await user.save();

		// const url = `${process.env.BASE_URL}user/${user.id}/verify/${token}`;
		// await sendEmail(user.email, "Verify Email", url);
		return res.status(201).send({
			message: "Registration Successfull!!",
			// message: "An Email sent to your account please verify",
			token: token,
			user: _.pick(result, ["_id", "name", "email", "quota"]),
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.signIn = async (req, res) => {
	try {
		let user = await cloudUser.findOne({
			email: req.body.email,
		});

		if (!user) return res.status(400).send("Invalid Email or Password");

		const validUser = await bcrypt.compare(req.body.password, user.password);

		if (!validUser) return res.status(400).send("Invalid Email or Password");

		// if (!user.verified) {
		// 	let token = await Token.findOne({ userId: user._id });
		// 	if (!token) {
		// 		token = await new Token({
		// 			userId: user._id,
		// 			token: crypto.randomBytes(32).toString("hex"),
		// 		}).save();
		// 		const url = `${process.env.BASE_URL}user/${user.id}/verify/${token.token}`;
		// 		await sendEmail(user.email, "Verify Email", url);
		// 	}

		// 	return res
		// 		.status(400)
		// 		.send({ message: "An Email sent to your account please verify" });
		// }

		const token = user.generateJWT();

		return res.status(200).send({
			message: "Login Successfull!!",
			token: token,
			user: _.pick(user, ["_id", "name", "email", "role"]),
		});
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
};
