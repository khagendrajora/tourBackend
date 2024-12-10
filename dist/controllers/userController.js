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
exports.verifyAndResetPwd = exports.addBusinessByAdmin = exports.resetPass = exports.forgetPass = exports.businessApprove = exports.getAdmin = exports.adminlogin = exports.addAdminUser = void 0;
const adminUser_1 = __importDefault(require("../models/adminUser"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const business_1 = __importDefault(require("../models/business"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = __importDefault(require("../models/token"));
const { customAlphabet } = require("nanoid");
const uuid_1 = require("uuid");
const Driver_1 = __importDefault(require("../models/Drivers/Driver"));
const setEmail_1 = require("../utils/setEmail");
const userModel_1 = __importDefault(require("../models/User/userModel"));
const addAdminUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { adminName, adminEmail, adminPwd } = req.body;
    const customId = customAlphabet("1234567890", 4);
    const adminId = customId();
    try {
        const salt = yield bcryptjs_1.default.genSalt(5);
        const hashedPwd = yield bcryptjs_1.default.hash(adminPwd, salt);
        let user = new adminUser_1.default({
            adminName,
            adminEmail,
            adminPwd: hashedPwd,
            adminId: adminId,
        });
        const email = yield userModel_1.default.findOne({ userEmail: adminEmail });
        if (email) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const driverEmail = yield Driver_1.default.findOne({ driverEmail: adminEmail });
        if (driverEmail) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const businessEmail = yield business_1.default.findOne({ primaryEmail: adminEmail });
        if (businessEmail) {
            return res.status(400).json({ error: "Email already registered" });
        }
        adminUser_1.default.findOne({ adminEmail }).then((data) => __awaiter(void 0, void 0, void 0, function* () {
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
    const { adminEmail, adminPwd } = req.body;
    try {
        if (!adminEmail || !adminPwd) {
            return res.status(400).json({ error: "fill all Fields" });
        }
        const data = yield adminUser_1.default.findOne({ adminEmail: adminEmail });
        if (!data) {
            return res.status(404).json({ error: "Email not found" });
        }
        const isPassword = yield bcryptjs_1.default.compare(adminPwd, data.adminPwd);
        if (!isPassword) {
            return res.status(400).json({ error: "password  not matched" });
        }
        const userID = data.id;
        const authToken = jsonwebtoken_1.default.sign(userID, process.env.JWTSECRET);
        res.cookie("authToken", authToken, {
            // httpOnly: true,
            // sameSite: "strict",
            // maxAge: 3600000,
            // secure: false,
            expires: new Date(Date.now() + 99999),
        });
        return res.status(200).json({
            message: "Login succssfully",
            authToken: authToken,
            userId: data._id,
            adminEmail: adminEmail,
            adminName: data.adminName,
            adminRole: data.adminRole,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.adminlogin = adminlogin;
const getAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield adminUser_1.default.find().then((data) => {
            if (!data) {
                return res.status(400).json({ error: "Failed to get Users" });
            }
            else {
                return res.send(data);
            }
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getAdmin = getAdmin;
const businessApprove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let status = "";
    // const authToken = req.cookies.authToken;
    // if (!authToken) {
    //   return res.status(404).json({ error: "Token not found or login first" });
    // }
    try {
        // const decodedToken = jwt.verify(
        //   authToken,
        //   process.env.JWTSECRET as string
        // ) as { id: string };
        // const userId = decodedToken.id;
        // const user = await AdminUser.findOne({ userId });
        // if (!user) {
        //   return res.status(404).json({ err: "failed to Get user ID" });
        // }
        // if (user?.Role == true) {
        const business = yield business_1.default.findOne({ bId: id });
        if (!business) {
            return res.status(404).json({ error: "Business not found" });
        }
        business.isActive = !business.isActive;
        const updatedBusiness = yield business.save();
        if (business.isActive) {
            status = "Activated";
        }
        else {
            status = "Deactivated";
        }
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: business.primaryEmail,
            subject: "Business Account Status ",
            html: `<h2>Your business account with business Id ${id} has been made ${status}</h2>`,
        });
        return res.status(200).json({
            data: updatedBusiness,
            message: `Business is ${status}`,
        });
        // } else {
        //   return res.status(401).json({ error: "Unauthorized" });
        // }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.businessApprove = businessApprove;
// export const adminSignOut = async (req: Request, res: Response) => {
//   const authToken = req.cookies.authToken;
//   try {
//     if (!authToken) {
//       return res.status(400).json({ error: "token not found " });
//     } else {
//       res.clearCookie("authToken", {
//         // httpOnly: true,
//         // sameSite: "strict",
//       });
//       return res.status(200).json({ message: "Sign Out Successfully" });
//     }
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// };
const forgetPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let adminEmail = req.body.adminEmail;
    try {
        const data = yield adminUser_1.default.findOne({ adminEmail });
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
            to: data.adminEmail,
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
    const newPwd = req.body.adminPwd;
    try {
        const data = yield token_1.default.findOne({ token });
        if (!data) {
            return res.status(404).json({ error: "Token not found" });
        }
        const userId = yield adminUser_1.default.findOne({ _id: data.userId });
        if (!userId) {
            return res.status(404).json({ error: "Token and Email not matched" });
        }
        const isOldPwd = yield bcryptjs_1.default.compare(newPwd, userId.adminPwd);
        if (isOldPwd) {
            return res.status(400).json({ error: "Password Previously Used" });
        }
        else {
            const salt = yield bcryptjs_1.default.genSalt(5);
            let hashedPwd = yield bcryptjs_1.default.hash(newPwd, salt);
            userId.adminPwd = hashedPwd;
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
const addBusinessByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customId = customAlphabet("1234567890", 4);
    let bId = customId();
    bId = "B" + bId;
    const { registrationNumber } = req.body.businessRegistration;
    const { street } = req.body.businessAddress;
    const { businessName, businessCategory, primaryEmail, primaryPhone, businessPwd, } = req.body;
    try {
        if (businessPwd == "") {
            return res.status(400).json({ error: "Password is reqired" });
        }
        const tax = yield business_1.default.findOne({
            "businessRegistration.registrationNumber": registrationNumber,
        });
        if (tax) {
            return res
                .status(400)
                .json({ error: "Registration Number is already Used" });
        }
        const email = yield business_1.default.findOne({ primaryEmail });
        if (email) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const userEmail = yield userModel_1.default.findOne({ userEmail: primaryEmail });
        if (userEmail) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const driverEmail = yield Driver_1.default.findOne({ driverEmail: primaryEmail });
        if (driverEmail) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const adminEmail = yield adminUser_1.default.findOne({ adminEmail: primaryEmail });
        if (adminEmail) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const phone = yield business_1.default.findOne({ primaryPhone });
        if (phone) {
            return res
                .status(400)
                .json({ error: "Phone Number already registered " });
        }
        const salt = yield bcryptjs_1.default.genSalt(5);
        let hashedPassword = yield bcryptjs_1.default.hash(businessPwd, salt);
        let business = new business_1.default({
            businessName,
            businessCategory,
            businessRegistration: {
                registrationNumber,
            },
            businessAddress: {
                street,
            },
            primaryEmail,
            primaryPhone,
            bId: bId,
            businessPwd: hashedPassword,
        });
        business = yield business.save();
        if (!business) {
            hashedPassword = "";
            return res.status(400).json({ error: "Failed to save the business" });
        }
        let token = new token_1.default({
            token: (0, uuid_1.v4)(),
            userId: business._id,
        });
        token = yield token.save();
        if (!token) {
            return res.status(400).json({ error: "Token not generated" });
        }
        const url = `${process.env.FRONTEND_URL}/resetandverify/${token.token}`;
        const api = `${process.env.Backend_URL}`;
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: business.primaryEmail,
            subject: "Account Verification Link",
            text: `Verify your Business Email to Login\n\n
      ${api}/resetandverify/${token.token}`,
            html: `<h1>Reset Password to Verify</h1> 
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
exports.addBusinessByAdmin = addBusinessByAdmin;
const verifyAndResetPwd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const newPwd = req.body.businessPwd;
    try {
        const data = yield token_1.default.findOne({ token });
        if (!data) {
            return res.status(404).json({ error: "Token Expired" });
        }
        const businessId = yield business_1.default.findOne({ _id: data.userId });
        if (!businessId) {
            return res.status(404).json({ error: "Token and Email not matched" });
        }
        if (businessId.isVerified) {
            return res.status(400).json({ error: "Email Already verified" });
        }
        const isOldPwd = yield bcryptjs_1.default.compare(newPwd, businessId.businessPwd);
        if (isOldPwd) {
            return res.status(400).json({ error: "Password Previously Used" });
        }
        else {
            const salt = yield bcryptjs_1.default.genSalt(5);
            let hashedPwd = yield bcryptjs_1.default.hash(newPwd, salt);
            businessId.businessPwd = hashedPwd;
            businessId.isVerified = true;
            yield token_1.default.deleteOne({ _id: data._id });
            businessId.save().then((business) => {
                if (!business) {
                    return res.status(400).json({ error: "Failed to Verify" });
                }
                else {
                    (0, setEmail_1.sendEmail)({
                        from: "beta.toursewa@gmail.com",
                        to: "khagijora2074@gmail.com",
                        subject: "New Business Registered",
                        html: `<h2>A new business with business Id ${businessId.bId} has been registered</h2>
          <a href='${process.env.FRONTEND_URL}/businessapprove/${businessId.bId}'>Click to verify and activate the business account</a>
          `,
                    });
                }
            });
            return res
                .status(200)
                .json({ message: "Email Verified and New Password is set" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.verifyAndResetPwd = verifyAndResetPwd;
