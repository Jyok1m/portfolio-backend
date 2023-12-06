const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			trim: true,
			required: true,
		},
		lastname: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			trim: true,
			required: true,
		},
		company: {
			type: String,
			trim: true,
			required: true,
		},
		phone: {
			type: String,
			trim: true,
			required: true,
		},
		message: {
			type: String,
			trim: true,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.models.inquiries || mongoose.model("inquiries", inquirySchema);
