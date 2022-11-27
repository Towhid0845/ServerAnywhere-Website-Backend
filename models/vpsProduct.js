const { Schema, model } = require("mongoose");
const Joi = require("joi");

module.exports.vpsProduct = model(
	"Vps",
	Schema(
		{
			category: {
				type: Schema.Types.ObjectId,
				ref: "VpsCategory",
				required: true,
			},
			price: Number,
			processor: String,
			RAM: Number,
			diskspace: Number,
			OS: String,
			// dedicatedIP: Number,
			// bandwidth: String,
			// windowsserver: String,
			// support: String,
			// RAID: Number,
			// cloudlinux: Number,
			// cpanelsupport: Number,
			// intelversion: String,
			// parkdomain: String,
			// subdomain: String,
			// email: String,
			// mysqlDB: String,
			// connection: Number,
			// location: String,
			// KVM: String,
			// vpspanel: String,
			// cpanelsololisense: String,
			// other: String,
		},
		{ timestamps: true }
	)
);

module.exports.validate = (product) => {
	const schema = Joi.object({
		category: Joi.string().required(),
		price: Joi.number().required(),
		processor: Joi.string(),
		RAM: Joi.number(),
		diskspace: Joi.number(),
		OS: Joi.string(),
		// dedicatedIP: Joi.number(),
		// bandwidth: Joi.string(),
		// windowsserver: Joi.string(),
		// support: Joi.string(),
		// RAID: Joi.number(),
		// cloudlinux: Joi.number(),
		// cpanelsupport: Joi.number(),
		// intelversion: Joi.string(),
		// parkdomain: Joi.string(),
		// subdomain: Joi.string(),
		// email: Joi.string(),
		// mysqlDB: Joi.string(),
		// connection: Joi.number(),
		// location: Joi.string(),
		// KVM: Joi.string(),
		// vpspanel: Joi.string(),
		// cpanelsololisense: Joi.string(),
		// other: Joi.string(),
	});
	return schema.validate(product);
};
