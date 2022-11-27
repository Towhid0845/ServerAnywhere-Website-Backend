const express = require("express");
// const { User, validate } = require("../models/user");
const router = express.Router();
const {
	signUp,
	verify,
	signIn,
	verifyOTP,
	resendOTP,
} = require("../controllers/userControllers");
const auth = require("../middlewares/authorize");
const admin = require("../middlewares/admin");

router.route("/signup").post(signUp);
// router.route("/:id/verify/:token/").get(verify);
router.get("/:id/verify/:token/", async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		await User.updateOne({ _id: user._id, verified: true });
		await token.remove();

		res.status(200).send({ message: "Email verified successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.route("/signin").post(signIn);

router.post("/verify-otp/", [auth, admin], verifyOTP);
router.post("/resend-otp/", [auth, admin], resendOTP);

module.exports = router;
