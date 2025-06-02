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
const Driver_1 = __importDefault(require("../models/Business/Driver"));
const business_1 = __importDefault(require("../models/Business/business"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const businessManager_1 = __importDefault(require("../models/Business/businessManager"));
const Sales_1 = __importDefault(require("../models/Business/Sales"));
// const createAuthToken = (id: string) => {
//   return jwt.sign({ id }, process.env.JWTSECRET as string, { expiresIn: "1h" });
// };
// const setAuthCookie = (res: Response, authToken: string) => {
//   res.cookie("authTOken", authToken, {
//     httpOnly: true,
//     sameSite: "strict",
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 3600000,
//   });
// };
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, Pwd } = req.body;
    let userData;
    try {
        const user = (yield userModel_1.default.findOne({ email })) ||
            (yield business_1.default.findOne({ primaryEmail: email })) ||
            (yield Driver_1.default.findOne({ email })) ||
            (yield businessManager_1.default.findOne({ email })) ||
            (yield Sales_1.default.findOne({ email }));
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        const isPassword = yield bcryptjs_1.default.compare(Pwd, user.password);
        if (!isPassword) {
            return res.status(400).json({ error: "Credentials not matched" });
        }
        if ("isVerified" in user && user.isVerified === false) {
            return res.status(400).json({ error: "Email not Verified" });
        }
        if ("isActive" in user && user.isActive === false) {
            return res.status(400).json({ error: "Account not Activated" });
        }
        if (!process.env.JWTSECRET) {
            return res.status(500).json({ error: "JWT_SECRET is not defined" });
        }
        const authToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWTSECRET, {
            expiresIn: "1h",
        });
        if (!authToken)
            return res.status(401).json({ error: "Failed" });
        // const authToken = createAuthToken(user._id.toString());
        // setAuthCookie(res, authToken);
        if (user instanceof userModel_1.default) {
            userData = {
                email: email,
                loginedId: user.userId,
                role: user.role,
                name: user.name,
            };
        }
        else if (user instanceof Driver_1.default) {
            userData = {
                loginedId: user.driverId,
                businessId: user.businessId,
                role: user.role,
                email: email,
                name: user.name,
            };
        }
        else if (user instanceof business_1.default) {
            userData = {
                loginedId: user.businessId,
                role: user.role,
                email: email,
                name: user.businessName,
            };
        }
        else if (user instanceof businessManager_1.default) {
            userData = {
                businessId: user.businessId,
                role: user.role,
                email: email,
                name: user.name,
                loginedId: user.managerId,
            };
        }
        else if (user instanceof Sales_1.default) {
            userData = {
                businessId: user.businessId,
                role: user.role,
                email: email,
                name: user.name,
                loginedId: user.salesId,
            };
        }
        return res.status(200).json({
            message: "Login Successful",
            authToken,
            userData: userData,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.login = login;
