const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
// const axios = require("axios");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
// const cors = require(cors);

// app.use(
// 	cors({
// 		origin: "http://localhost:3001",
// 	})
// );
// const getPin = () => {
// 	const otp = Math.floor(Math.random() * 10000);
// 	if (otp.toString().length === 4) {
// 		return otp;
// 	} else {
// 		return getPin();
// 	}
// };

module.exports.signUp = async (req, res) => {
	try {
		const { error } = validate(req.body);

		if (error) return res.status(400).send(error.details[0].message);

		let user = {};
		user = await User.findOne({
			email: req.body.email,
		});
		if (user) return res.status(400).send("User already registered");

		user = new User(_.pick(req.body, ["name", "email", "password"]));

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
		// user = await new User({ ...req.body, password: hashPassword }).save();
		const token = user.generateJWT();
		// const token = await new Token({
		// 	userId: user._id,
		// 	token: crypto.randomBytes(32).toString("hex"),
		// }).save();

		const result = await user.save();
		//save();

		const url = `${process.env.BASE_URL}user/${user.id}/verify/${token}`;
		await sendEmail(user.email, "Verify Email", url);
		return res.status(201).send({
			// message: "Registration Successfull!!",
			message: "An Email sent to your account please verify",
			token: token,
			user: _.pick(result, ["_id", "name", "email"]),
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.signIn = async (req, res) => {
	try {
		let user = await User.findOne({
			email: req.body.email,
		});

		if (!user) return res.status(400).send("Invalid Email or Password");

		const validUser = await bcrypt.compare(req.body.password, user.password);

		if (!validUser) return res.status(400).send("Invalid Email or Password");

		if (!user.verified) {
			let token = await Token.findOne({ userId: user._id });
			if (!token) {
				token = await new Token({
					userId: user._id,
					token: crypto.randomBytes(32).toString("hex"),
				}).save();
				const url = `${process.env.BASE_URL}user/${user.id}/verify/${token.token}`;
				await sendEmail(user.email, "Verify Email", url);
			}

			return res
				.status(400)
				.send({ message: "An Email sent to your account please verify" });
		}

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

// module.exports.verify = async (req, res) => {
// 	try {
// 		const user = await User.findOne({ _id: req.params.id });
// 		if (!user) return res.status(400).send({ message: "Invalid link" });

// 		const token = await Token.findOne({
// 			userId: user._id,
// 			token: req.params.token,
// 		});
// 		if (!token) return res.status(400).send({ message: "Invalid link" });

// 		await User.updateOne({ _id: user._id, verified: true });
// 		await token.remove();

// 		res.status(200).send({ message: "Email verified successfully" });
// 	} catch (error) {
// 		res.status(500).send({ message: "Internal Server Error" });
// 	}
// };

// module.exports.signIn = async (req, res) => {
//   let user = await User.findOne({
//     email: req.body.email,
//   });

//   if (!user) return res.status(400).send("Invalid Email or Password");

//   const validUser = await bcrypt.compare(req.body.password, user.password);
//   if (!validUser) return res.status(400).send("Invalid Email or Password");
//   else {
//     const otp = getPin();
//     console.log(otp);
//     const data = {
//       from: {
//         email: "no-reply@usdsc.net",
//       },
//       to: [
//         {
//           email: req.body.email,
//         },
//       ],
//       subject: "Server Anywhere Demo - OTP",
//       html: `<html>

//                         <head>
//                             <style>
//                                 @media only screen and (max-width: 620px) {
//                                     table.body h1 {
//                                         font-size: 28px !important;
//                                         margin-bottom: 10px !important;
//                                     }

//                                     table.body p,
//                                     table.body ul,
//                                     table.body ol,
//                                     table.body td,
//                                     table.body span,
//                                     table.body a {
//                                         font-size: 16px !important;
//                                     }

//                                     table.body .wrapper,
//                                     table.body .article {
//                                         padding: 10px !important;
//                                     }

//                                     table.body .content {
//                                         padding: 0 !important;
//                                     }

//                                     table.body .container {
//                                         padding: 0 !important;
//                                         width: 100% !important;
//                                     }

//                                     table.body .main {
//                                         border-left-width: 0 !important;
//                                         border-radius: 0 !important;
//                                         border-right-width: 0 !important;
//                                     }

//                                     table.body .btn table {
//                                         width: 100% !important;
//                                     }

//                                     table.body .btn a {
//                                         width: 100% !important;
//                                     }

//                                     table.body .img-responsive {
//                                         height: auto !important;
//                                         max-width: 100% !important;
//                                         width: auto !important;
//                                     }
//                                 }

//                                 @media all {
//                                     .ExternalClass {
//                                         width: 100%;
//                                     }

//                                     .ExternalClass,
//                                     .ExternalClass p,
//                                     .ExternalClass span,
//                                     .ExternalClass font,
//                                     .ExternalClass td,
//                                     .ExternalClass div {
//                                         line-height: 100%;
//                                     }

//                                     .apple-link a {
//                                         color: inherit !important;
//                                         font-family: inherit !important;
//                                         font-size: inherit !important;
//                                         font-weight: inherit !important;
//                                         line-height: inherit !important;
//                                         text-decoration: none !important;
//                                     }

//                                     #MessageViewBody a {
//                                         color: inherit;
//                                         text-decoration: none;
//                                         font-size: inherit;
//                                         font-family: inherit;
//                                         font-weight: inherit;
//                                         line-height: inherit;
//                                     }

//                                     .btn-primary table td:hover {
//                                         background-color: #34495e !important;
//                                     }

//                                     .btn-primary a:hover {
//                                         background-color: #34495e !important;
//                                         border-color: #34495e !important;
//                                     }
//                                 }
//                             </style>
//                         </head>

//                         <body style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
//                             <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f6f6; width: 100%;" width="100%" bgcolor="#f6f6f6">
//                                 <tr>
//                                     <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
//                                     <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;"
//                                         width="580" valign="top">
//                                         <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">

//                                             <!-- START CENTERED WHITE CONTAINER -->
//                                             <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">
//                                                 <tr>
//                                                     <td style="background-color: #d6d6d6; padding: 4px 0px; width: 100%; text-align: center;">

//                                                     </td>
//                                                 </tr>

//                                                 <!-- START MAIN CONTENT AREA -->
//                                                 <tr>
//                                                     <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
//                                                         <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
//                                                             <tr>
//                                                                 <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"valign="top">
//                                                                     <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
//                                                                         Hello ${user.name},</p>
//                                                                     <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
//                                                                         Your OTP is
//                                                                     </p>
//                                                                     <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%;" width="100%">
//                                                                         <tbody>
//                                                                             <tr>
//                                                                                 <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"
//                                                                                     valign="top">
//                                                                                     <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
//                                                                                         <tbody>
//                                                                                             <tr>
//                                                                                                 <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: #3498db;" valign="top" align="center" bgcolor="#3498db">
//                                                                                                     <div style="border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; background-color: #3498db; border-color: #3498db; color: #ffffff;">
//                                                                                                     ${otp}
//                                                                                                     </div>
//                                                                                                 </td>
//                                                                                             </tr>
//                                                                                         </tbody>
//                                                                                     </table>
//                                                                                 </td>
//                                                                             </tr>
//                                                                         </tbody>
//                                                                     </table>
//                                                                 </td>
//                                                             </tr>
//                                                         </table>
//                                                     </td>
//                                                 </tr>
//                                                 <!-- END MAIN CONTENT AREA -->
//                                             </table>
//                                             <!-- END CENTERED WHITE CONTAINER -->
//                                             <!-- START FOOTER -->
//                                             <div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">
//                                                 <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
//                                                     width="100%">
//                                                     <tr>
//                                                         <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #999999; font-size: 12px; text-align: center;" valign="top" align="center">
//                                                             <p class="apple-link" style="color: #999999; font-size: 16px; text-align: center;">
//                                                                 Regards,<br>
//                                                                 Server Anywhere <br>
//                                                                 support@serveranywhere.net
//                                                             </p>
//                                                         </td>
//                                                     </tr>
//                                                 </table>
//                                             </div>
//                                             <!-- END FOOTER -->

//                                         </div>

//                                     </td>
//                                     <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
//                                 </tr>
//                             </table>
//                         </body>
//                     </html>`,
//     };
//     console.log(data);

//     const sendMail = await axios({
//       method: "POST",
//       url: "https://api.mailersend.com/v1/email",
//       data: data,
//       headers: {
//         "content-Type": "application/json",
//         Authorization: `Bearer ${process.env.MAILER_SEND_TOKEN}`,
//       },
//     });

//     if (sendMail.status === 202) {
//       await User.updateOne({ _id: user._id }, { otp: otp });

//       const token = user.generateJWT();

//       return res.status(200).send({
//         message: "Login Successfull!!",
//         token: token,
//         user: _.pick(user, ["_id", "name", "email", "otp"]),
//       });
//     } else {
//       res.status(400).send({ message: "Email not sent" });
//     }
//   }

//   //   const token = user.generateJWT();
// };

// exports.verifyOTP = async (req, res) => {
// 	const user = await User.findOne({ email: req.body.email });
// 	if (user) {
// 		if (req.body.otp === user.otp) {
// 			const token = user.generateJWT();

// 			res.status(200).send({
// 				token: token,
// 				admin: {
// 					_id: user._id,
// 					name: user.name,
// 					email: user.email,
// 					role: user.role,
// 				},
// 				message: "Otp verified",
// 			});
// 		} else {
// 			res.status(400).send({ message: "Invalid OTP!" });
// 		}
// 	} else {
// 		res.status(404).send({ message: "Admin not found!" });
// 	}
// };

// exports.resendOTP = async (req, res) => {
// 	const user = await User.findOne({ email: req.body.email });
// 	// user is admin
// 	if (user.role === "admin") {
// 		const otp = getPin();

// 		const data = {
// 			from: {
// 				email: "no-reply@usdsc.net",
// 			},
// 			to: [
// 				{
// 					email: req.body.email,
// 				},
// 			],
// 			subject: "Server Anywhere - OTP",
// 			html: `<html>

//                         <head>
//                             <style>
//                                 @media only screen and (max-width: 620px) {
//                                     table.body h1 {
//                                         font-size: 28px !important;
//                                         margin-bottom: 10px !important;
//                                     }

//                                     table.body p,
//                                     table.body ul,
//                                     table.body ol,
//                                     table.body td,
//                                     table.body span,
//                                     table.body a {
//                                         font-size: 16px !important;
//                                     }

//                                     table.body .wrapper,
//                                     table.body .article {
//                                         padding: 10px !important;
//                                     }

//                                     table.body .content {
//                                         padding: 0 !important;
//                                     }

//                                     table.body .container {
//                                         padding: 0 !important;
//                                         width: 100% !important;
//                                     }

//                                     table.body .main {
//                                         border-left-width: 0 !important;
//                                         border-radius: 0 !important;
//                                         border-right-width: 0 !important;
//                                     }

//                                     table.body .btn table {
//                                         width: 100% !important;
//                                     }

//                                     table.body .btn a {
//                                         width: 100% !important;
//                                     }

//                                     table.body .img-responsive {
//                                         height: auto !important;
//                                         max-width: 100% !important;
//                                         width: auto !important;
//                                     }
//                                 }

//                                 @media all {
//                                     .ExternalClass {
//                                         width: 100%;
//                                     }

//                                     .ExternalClass,
//                                     .ExternalClass p,
//                                     .ExternalClass span,
//                                     .ExternalClass font,
//                                     .ExternalClass td,
//                                     .ExternalClass div {
//                                         line-height: 100%;
//                                     }

//                                     .apple-link a {
//                                         color: inherit !important;
//                                         font-family: inherit !important;
//                                         font-size: inherit !important;
//                                         font-weight: inherit !important;
//                                         line-height: inherit !important;
//                                         text-decoration: none !important;
//                                     }

//                                     #MessageViewBody a {
//                                         color: inherit;
//                                         text-decoration: none;
//                                         font-size: inherit;
//                                         font-family: inherit;
//                                         font-weight: inherit;
//                                         line-height: inherit;
//                                     }

//                                     .btn-primary table td:hover {
//                                         background-color: #34495e !important;
//                                     }

//                                     .btn-primary a:hover {
//                                         background-color: #34495e !important;
//                                         border-color: #34495e !important;
//                                     }
//                                 }
//                             </style>
//                         </head>

//                         <body style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
//                             <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f6f6; width: 100%;" width="100%" bgcolor="#f6f6f6">
//                                 <tr>
//                                     <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
//                                     <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;"
//                                         width="580" valign="top">
//                                         <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">

//                                             <!-- START CENTERED WHITE CONTAINER -->
//                                             <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">
//                                                 <tr>
//                                                     <td style="background-color: #d6d6d6; padding: 4px 0px; width: 100%; text-align: center;">

//                                                     </td>
//                                                 </tr>

//                                                 <!-- START MAIN CONTENT AREA -->
//                                                 <tr>
//                                                     <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
//                                                         <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
//                                                             <tr>
//                                                                 <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"valign="top">
//                                                                     <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
//                                                                         Hello ${user.name},</p>
//                                                                     <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
//                                                                         You recently requested to login admin panel. This is your OTP for verify you.
//                                                                     </p>
//                                                                     <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%;" width="100%">
//                                                                         <tbody>
//                                                                             <tr>
//                                                                                 <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"
//                                                                                     valign="top">
//                                                                                     <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
//                                                                                         <tbody>
//                                                                                             <tr>
//                                                                                                 <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: #3498db;" valign="top" align="center" bgcolor="#3498db">
//                                                                                                     <div style="border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; background-color: #3498db; border-color: #3498db; color: #ffffff;">
//                                                                                                     ${otp}
//                                                                                                     </div>
//                                                                                                 </td>
//                                                                                             </tr>
//                                                                                         </tbody>
//                                                                                     </table>
//                                                                                 </td>
//                                                                             </tr>
//                                                                         </tbody>
//                                                                     </table>
//                                                                 </td>
//                                                             </tr>
//                                                         </table>
//                                                     </td>
//                                                 </tr>
//                                                 <!-- END MAIN CONTENT AREA -->
//                                             </table>
//                                             <!-- END CENTERED WHITE CONTAINER -->
//                                             <!-- START FOOTER -->
//                                             <div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">
//                                                 <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
//                                                     width="100%">
//                                                     <tr>
//                                                         <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #999999; font-size: 12px; text-align: center;" valign="top" align="center">
//                                                             <p class="apple-link" style="color: #999999; font-size: 16px; text-align: center;">
//                                                                 Regards,<br>
//                                                                 serveranywhere.org <br>
//                                                                 support@server anywhere
//                                                             </p>
//                                                         </td>
//                                                     </tr>
//                                                 </table>
//                                             </div>
//                                             <!-- END FOOTER -->

//                                         </div>

//                                     </td>
//                                     <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
//                                 </tr>
//                             </table>
//                         </body>
//                     </html>`,
// 		};

// 		const sendMail = await axios({
// 			method: "POST",
// 			url: "https://api.mailersend.com/v1/email",
// 			data: data,
// 			headers: {
// 				"content-Type": "application/json",
// 				Authorization: `Bearer ${process.env.MAILER_SEND_TOKEN}`,
// 			},
// 		});

// 		if (sendMail.status === 202) {
// 			await User.updateOne({ _id: user._id }, { otp: otp });

// 			res.status(200).send({
// 				message: "Resend OTP Send Successful",
// 			});
// 		} else {
// 			res.status(400).send({ message: "Email not sent" });
// 		}
// 	} else {
// 		res.status(403).send({ message: "You are not admin" });
// 	}
// };
