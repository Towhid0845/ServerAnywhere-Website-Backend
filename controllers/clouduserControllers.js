const bcrypt = require("bcrypt");
const _ = require("lodash");
const { CloudUser, validate } = require("../models/cloud_user");
const axios = require("axios");

module.exports.signUp = async (req, res) => {
	const { error } = validate(req.body);

	if (error) return res.status(400).send(error.details[0].message);

	let user = {};
	user = await CloudUser.findOne({
		email: req.body.email,
	});
	if (user) return res.status(400).send("User already registered");

	user = new CloudUser(_.pick(req.body, ["name", "email", "password"]));

	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);

	const token = user.generateJWT();

	const result = await user.save();
	return res.status(201).send({
		message: "Registration Successfull!!",
		token: token,
		user: _.pick(result, ["_id", "name", "email"]),
	});
};

module.exports.signIn = async (req, res) => {
	let user = await CloudUser.findOne({
		email: req.body.email,
	});

	if (!user) return res.status(400).send("Invalid Email or Password");

	const validUser = await bcrypt.compare(req.body.password, user.password);

	if (!validUser) return res.status(400).send("Invalid Email or Password");

	const token = user.generateJWT();

	return res.status(200).send({
		message: "Login Successfull!!",
		token: token,
		user: _.pick(user, ["_id", "name", "email"]),
	});
};
// userSchema.methods.generateJWT = function () {
// 	const token = jwt.sign(
// 		{
// 			_id: this._id,
// 			email: this.email,
// 			role: this.role,
// 			name: this.name,
// 		},
// 		process.env.JWT_SECRET_KEY,
// 		{ expiresIn: "7d" }
// 	);

// 	return token;
// };
