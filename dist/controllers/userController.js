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
exports.resetPass = exports.forgetPass = exports.adminSignOut = exports.businessApprove = exports.adminlogin = exports.addAdminUser = void 0;
const adminUser_1 = __importDefault(require("../models/adminUser"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const business_1 = __importDefault(require("../models/business"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = __importDefault(require("../models/token"));
const uuid_1 = require("uuid");
const setEmail_1 = require("../utils/setEmail");
const addAdminUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { adminName, Email, Pwd, cPwd } = req.body;
    try {
        // if (Pwd !== cPwd) {
        //   return res
        //     .status(400)
        //     .json({ error: "password and confirm password dosent matched" });
        // }
        const salt = yield bcryptjs_1.default.genSalt(5);
        const hashedPwd = yield bcryptjs_1.default.hash(Pwd, salt);
        let user = new adminUser_1.default({
            adminName,
            Email,
            Pwd: hashedPwd,
            cPwd: hashedPwd,
        });
        adminUser_1.default.findOne({ Email }).then((data) => __awaiter(void 0, void 0, void 0, function* () {
            if (data) {
                return res.status(400).json({ error: "Email already Used" });
            }
            else {
                user = yield user.save();
                if (!user) {
                    res.status(400).json({ error: "failed to submit" });
                }
                else {
                    return res.send(user);
                }
            }
        }));
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.addAdminUser = addAdminUser;
const adminlogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Email, Pwd } = req.body;
    try {
        if (!Email || !Pwd) {
            return res.status(400).json({ error: "fill all Fields" });
        }
        const data = yield adminUser_1.default.findOne({ Email: Email });
        if (!data) {
            return res.status(404).json({ error: "Email not found" });
        }
        const isPassword = yield bcryptjs_1.default.compare(Pwd, data.Pwd);
        if (!isPassword) {
            return res.status(400).json({ error: "password  not matched" });
        }
        const userID = data.id;
        const authToken = jsonwebtoken_1.default.sign(userID, process.env.JWTSECRET);
        res.cookie("authToken", authToken, {
            expires: new Date(Date.now() + 99999),
        });
        return res.status(200).json({
            message: "Login succssfully",
            authToken: authToken,
            adminEmail: Email,
            adminName: data.adminName,
            role: data.Role,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.adminlogin = adminlogin;
const businessApprove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const authToken = req.cookies.authToken;
    if (!authToken) {
        return res.status(404).json({ error: "Token not found or login first" });
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(authToken, process.env.JWTSECRET);
        const userId = decodedToken.id;
        const user = yield adminUser_1.default.findOne({ userId });
        if (!user) {
            return res.status(404).json({ err: "failed to Get user ID" });
        }
        if ((user === null || user === void 0 ? void 0 : user.Role) == true) {
            const business = yield business_1.default.findById(id);
            if (!business) {
                return res.status(404).json({ error: "Business not found" });
            }
            business.isActive = !business.isActive;
            const updatedBusiness = yield business.save();
            return res.status(200).json({
                data: updatedBusiness,
            });
        }
        else {
            return res.status(401).json({ error: "Unauthorized" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.businessApprove = businessApprove;
const adminSignOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = req.cookies.authToken;
    try {
        if (!authToken) {
            return res.status(400).json({ error: "token not found " });
        }
        else {
            res.clearCookie("authToken", {
                httpOnly: true,
                sameSite: "strict",
            });
            return res.status(200).json({ message: "Sign Out Successfully" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.adminSignOut = adminSignOut;
const forgetPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let Email = req.body.Email;
    try {
        const data = yield adminUser_1.default.findOne({ Email });
        if (!data) {
            return res.status(404).json({ error: "Email not found" });
        }
        let token = new token_1.default({
            token: (0, uuid_1.v4)(),
            userId: data._id,
        });
        token = yield token.save();
        if (!token) {
            return res.status(400).json({ error: "Token not generated" });
        }
        const url = `${process.env.FRONTEND_URL}/resetpwd/${token.token}`;
        const api = `${process.env.Backend_URL}`;
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: data.Email,
            subject: "Password Reset Link",
            text: `Reset password USing link below\n\n
    http://${api}/resetpwd/${token.token}
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
exports.forgetPass = forgetPass;
const resetPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const newPwd = req.body.Pwd;
    try {
        const data = yield token_1.default.findOne({ token });
        if (!data) {
            return res.status(404).json({ error: "Token not found" });
        }
        const userId = yield adminUser_1.default.findOne({ _id: data.userId });
        if (!userId) {
            return res.status(404).json({ error: "Token and Email not matched" });
        }
        else {
            const salt = yield bcryptjs_1.default.genSalt(5);
            let hashedPwd = yield bcryptjs_1.default.hash(newPwd, salt);
            userId.Pwd = hashedPwd;
            userId.save();
            yield token_1.default.deleteOne({ _id: data._id });
            return res.status(201).json({ message: "Successfully Reset" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.resetPass = resetPass;
