const express = require("express");
const { User, validate } = require("../models/user");
const Token = require("../models/token");
const router = express.Router();
const {
	signUp,
	signIn,
	// verifyOTP,
	// resendOTP,
} = require("../controllers/userControllers");
// const auth = require("../middlewares/authorize");
// const admin = require("../middlewares/admin");
const auth1 = require("../middlewares/userauth");

router.route("/signup").post(signUp);
router.get("/:id/verify/:token/", async (req, res) => {
	try {
		console.log("helloo from backend email verify");
		// console.log(token);
		// console.log(req.user._id);
		const token = req.params.token;

		const user = await User.findOne({ _id: req.params.id });
		console.log(user);
		if (!user) return res.status(400).send({ message: "Invalid link" });

		// const token = await Token.findOne({
		// 	userId: user._id,
		// 	token: req.params.token,
		// });
		if (!token) return res.status(400).send({ message: "Invalid token link" });

		await User.updateOne({ _id: user._id }, { verified: true });
		//await token.remove();

		res.status(200).send({ message: "Email verified successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.route("/signin").post(signIn);

// router.post("/verify-otp/", [auth, admin], verifyOTP);
// router.post("/resend-otp/", [auth, admin], resendOTP);

module.exports = router;
