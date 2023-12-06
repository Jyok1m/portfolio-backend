var express = require("express");
var router = express.Router();
const db = require("../database/db");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const capitalizeFirstLetter = require("../modules/capitalizeFirstLetter");
const { body, validationResult } = require("express-validator");

/* ---------------------------------------------------------------- */
/*                              POST /                              */
/* ---------------------------------------------------------------- */

router.post(
	"/",
	body("firstname").trim().escape().customSanitizer(capitalizeFirstLetter),
	body("lastname").trim().escape().customSanitizer(capitalizeFirstLetter),
	body("email").trim().escape().isEmail(),
	body("company").trim().escape(),
	body("phone").trim().escape(),
	body("message").trim().escape(),
	async function (req, res) {
		if (!validationResult(req).isEmpty()) {
			return res.status(400).json({ errors: validationResult(req).array() });
		}

		try {
			await db.inquiries.create({ ...req.body });

			const transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: process.env.NODEMAILER_EMAIL,
					pass: process.env.NODEMAILER_PASSWORD,
				},
			});

			const templatePath = path.join(__dirname, "../templates/emails/newMessage.hbs");
			const source = fs.readFileSync(templatePath, "utf8");
			const template = handlebars.compile(source);

			const mailOptions = {
				from: process.env.NODEMAILER_EMAIL,
				to: process.env.PERSONAL_EMAIL,
				subject: `Prise de contact - ${req.body.firstname} ${req.body.lastname}`,
				html: template({ ...req.body }),
			};

			await transporter.sendMail(mailOptions);

			return res.status(201).json({ message: "Message envoyé avec succès !" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur. Merci de regarder les logs." });
		}
	}
);

module.exports = router;
