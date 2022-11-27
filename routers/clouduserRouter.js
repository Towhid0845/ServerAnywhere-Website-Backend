const express = require("express");
const router = express.Router();
const { signUp, signIn } = require("../controllers/clouduserControllers");
const auth = require("../middlewares/authorize");
const admin = require("../middlewares/admin");

router.route("/signup").post(signUp);

router.route("/signin").post(signIn);

// router.post("/verify-otp/", [auth, admin], verifyOTP);
// router.post("/resend-otp/", [auth, admin], resendOTP);

module.exports = router;
