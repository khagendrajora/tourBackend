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
exports.login = void 0;
const userModel_1 = __importDefault(require("../models/User/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Driver_1 = __importDefault(require("../models/Drivers/Driver"));
const business_1 = __importDefault(require("../models/business"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, Pwd } = req.body;
    try {
        const clientEmail = yield userModel_1.default.findOne({
            userEmail: email,
        });
        if (clientEmail) {
            const isPassword = yield bcryptjs_1.default.compare(Pwd, clientEmail.userPwd);
            if (!isPassword) {
                return res.status(400).json({ error: "Credentials not matched" });
            }
            const isVerified = clientEmail.isVerified;
            if (!isVerified) {
                return res.status(400).json({ error: "Email not Verified" });
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
                userId: clientEmail.userId,
                clientId: clientEmail._id,
                userEmail: clientEmail.userEmail,
                userRole: clientEmail.userRole,
                userName: clientEmail.userName,
            });
        }
        else {
            const businessEmail = yield business_1.default.findOne({
                primaryEmail: email,
            });
            if (businessEmail) {
                const isPassword = yield bcryptjs_1.default.compare(Pwd, businessEmail.businessPwd);
                if (!isPassword) {
                    return res.status(400).json({ error: "Credentials not matched" });
                }
                const isVerified = businessEmail.isVerified;
                if (!isVerified) {
                    return res.status(400).json({ error: "Email not Verified" });
                }
                const isActive = businessEmail.isActive;
                if (!isActive) {
                    return res.status(400).json({ error: "Account not Activated" });
                }
                const data = { id: businessEmail._id };
                const authToken = jsonwebtoken_1.default.sign(data, process.env.JWTSECRET);
                res.cookie("authToken", authToken, {
                    httpOnly: true,
                    sameSite: "strict",
                    maxAge: 3600000,
                });
                return res.status(200).json({
                    message: "Login succssfully",
                    authToken: authToken,
                    businesId: businessEmail._id,
                    primaryEmail: businessEmail.primaryEmail,
                    businessRole: businessEmail.businessRole,
                    businessName: businessEmail.businessName,
                    bId: businessEmail.bId,
                });
            }
            else {
                const driverEmail = yield Driver_1.default.findOne({
                    driverEmail: email,
                });
                if (driverEmail) {
                    const isPassword = yield bcryptjs_1.default.compare(Pwd, driverEmail.driverPwd);
                    if (!isPassword) {
                        return res.status(400).json({ error: "Credentials not matched" });
                    }
                    const isVerified = driverEmail.isVerified;
                    if (!isVerified) {
                        return res.status(400).json({ error: "Email not Verified" });
                    }
                    const data = { id: email._id };
                    const authToken = jsonwebtoken_1.default.sign(data, process.env.JWTSECRET);
                    res.cookie("authToken", authToken, {
                        httpOnly: true,
                        sameSite: "strict",
                        maxAge: 3600000,
                    });
                    return res.status(200).json({
                        message: "Login succssfully",
                        authToken: authToken,
                        driver_id: driverEmail._id,
                        driverId: driverEmail.driverId,
                        driverEmail: driverEmail.driverEmail,
                        driverName: driverEmail.driverName,
                        vehicleId: driverEmail.vehicleId,
                    });
                }
                else {
                    return res.status(400).json({ error: "Data not found" });
                }
            }
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.login = login;
