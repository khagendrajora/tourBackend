"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPwd = exports.forgetPwd = exports.deleteClient = exports.getClientById = exports.clientLogin = exports.verifyUserEmail = exports.addNewClient = void 0;
const userModel_1 = __importDefault(require("../../models/Client/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const token_1 = __importDefault(require("../../models/token"));
const uuidv4_1 = require("uuidv4");
const setEmail_1 = require("../../utils/setEmail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const addNewClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, userEmail, userPwd } = req.body;
    try {
        if (userPwd == "") {
            return res.status(400).json({ error: "Password is reqired" });
        }
        const email = yield userModel_1.default.findOne({ userEmail });
        if (email) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const salt = yield bcryptjs_1.default.genSalt(5);
        let hashedPassword = yield bcryptjs_1.default.hash(userPwd, salt);
        let clientUser = new userModel_1.default({
            userName,
            userEmail,
            userPwd: hashedPassword,
        });
        clientUser = yield clientUser.save();
        if (!clientUser) {
            hashedPassword = "";
            return res.status(400).json({ error: "Failed to save the User" });
        }
        let token = new token_1.default({
            token: (0, uuidv4_1.uuid)(),
            userId: clientUser._id,
        });
        token = yield token.save();
        if (!token) {
            return res.status(400).json({ error: "Token not generated" });
        }
        const url = `${process.env.FRONTEND_URL}/verifyemail/${token.token}`;
        const api = `${process.env.Backend_URL}`;
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: clientUser.userEmail,
            subject: "Account Verification Link",
            text: `Verify your Business Email to Login\n\n
    ${api}/verifybusinessemail/${token.token}`,
            html: `<h1>Click to Verify Email</h1> 
          <a href='${url}'>Click here To verify</a>`,
        });
        hashedPassword = "";
        return res
            .status(200)
            .json({ message: "Verifying link has been sent to Email " });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.addNewClient = addNewClient;
const verifyUserEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    try {
        const data = yield token_1.default.findOne({ token });
        if (!data) {
            return res.status(404).json({ error: "Token Expired" });
        }
        const userId = yield userModel_1.default.findOne({ _id: data.userId });
        if (!userId) {
            return res.status(404).json({ error: "Token and Email not matched" });
        }
        if (userId.isVerified) {
            return res.status(400).json({ error: "Email Already verified" });
        }
        userId.isVerified = true;
        userId.save().then((user) => {
            if (!user) {
                return res.status(400).json({ error: "Failed to Verify" });
            }
            else {
                return res.status(200).json({ message: "Email Verified" });
            }
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.verifyUserEmail = verifyUserEmail;
const clientLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail, userPwd } = req.body;
    try {
        const clientEmail = yield userModel_1.default.findOne({
            userEmail: userEmail,
        });
        if (!clientEmail) {
            return res.status(404).json({
                error: "Email not found",
            });
        }
        const isPassword = yield bcryptjs_1.default.compare(userPwd, clientEmail.userPwd);
        if (!isPassword) {
            return res.status(400).json({ error: "Incorrect Password" });
        }
        const data = { id: clientEmail._id };
        const authToken = jsonwebtoken_1.default.sign(data, process.env.JWTSECRET);
        res.cookie("authToken", authToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 3600000,
        });
        return res.status(200).json({
            message: "Login succssfully",
            authToken: authToken,
            clientId: clientEmail._id,
            userEmail: clientEmail,
            userRole: clientEmail.userRole,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.clientLogin = clientLogin;
const getClientById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const client = yield userModel_1.default.findById(id);
        if (!client) {
            return res.status(200).json({ error: "Failed to get the Profile" });
        }
        else {
            return res.send(client);
        }
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.getClientById = getClientById;
const deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const deleteClient = yield userModel_1.default.findByIdAndDelete(id);
        if (!deleteClient) {
            return res.status(404).json({ error: "Failed to delete" });
        }
        return res.status(200).json({ message: "Successfully Deleted" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.deleteClient = deleteClient;
const forgetPwd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userEmail = req.body.userEmail;
    try {
        const data = yield userModel_1.default.findOne({ userEmail });
        if (!data) {
            return res.status(404).json({ error: "Email not found" });
        }
        let token = new token_1.default({
            token: (0, uuidv4_1.uuid)(),
            userId: data._id,
        });
        token = yield token.save();
        if (!token) {
            return res.status(400).json({ error: "Token not generated" });
        }
        const url = `${process.env.FRONTEND_URL}/resetuserpwd/${token.token}`;
        const api = `${process.env.Backend_URL}`;
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: data.userEmail,
            subject: "Password Reset Link",
            text: `Reset password Using link below\n\n
      ${api}/resetuserpwd/${token.token}
      `,
            html: `<h1>Click to Reset Password</h1>
      <a href='${url}'>Click here Reset</a>`,
        });
        return res
            .status(200)
            .json({ message: "Password reset link sent to your email" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.forgetPwd = forgetPwd;
const resetPwd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const newPwd = req.body.userPwd;
    try {
        const data = yield token_1.default.findOne({ token });
        if (!data) {
            return res.status(404).json({ error: "Token not found" });
        }
        const userId = yield userModel_1.default.findOne({ _id: data.userId });
        if (!userId) {
            return res.status(404).json({ error: "Token and Email not matched" });
        }
        else {
            const salt = yield bcryptjs_1.default.genSalt(5);
            let hashedPwd = yield bcryptjs_1.default.hash(newPwd, salt);
            userId.userPwd = hashedPwd;
            userId.save();
            yield token_1.default.deleteOne({ _id: data._id });
            return res.status(201).json({ message: "Reset Successful" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.resetPwd = resetPwd;
