"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (options) => {
    let nodemailers = nodemailer_1.default.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 587,
        secure: false,
        auth: {
            user: "ae7e97c689918e",
            pass: "a6b23360b72cf8",
        },
    });
    const mailOptions = {
        from: "beta_toursewa@gmail.com",
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    };
    nodemailers.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Error", error);
        }
        else {
            console.log("Email Sent", info.response);
        }
    });
};
exports.sendEmail = sendEmail;
