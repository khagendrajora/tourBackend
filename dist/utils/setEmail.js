"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (options) => {
    let nodemailers = nodemailer_1.default.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
            user: "khagijora2074@gmail.com",
            pass: "gkdjojpbrdixzyjk",
        },
    });
    const mailOptions = {
        from: options.from,
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
