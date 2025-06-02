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
exports.makePending = exports.removeFeatureProduct = exports.deleteFeatureRequest = exports.addFeature = exports.getFeature = exports.deleteAdmin = exports.verifyAndResetPwd = exports.addBusinessByAdmin = exports.resetPass = exports.forgetPass = exports.businessApprove = exports.getAdmin = exports.adminlogin = exports.addAdminUser = void 0;
const adminUser_1 = __importDefault(require("../models/adminUser"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const business_1 = __importDefault(require("../models/Business/business"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = __importDefault(require("../models/token"));
const nanoid_1 = require("nanoid");
const uuid_1 = require("uuid");
const Driver_1 = __importDefault(require("../models/Business/Driver"));
const setEmail_1 = require("../utils/setEmail");
const userModel_1 = __importDefault(require("../models/User/userModel"));
const tour_1 = __importDefault(require("../models/Product/tour"));
const trekking_1 = __importDefault(require("../models/Product/trekking"));
const vehicle_1 = __importDefault(require("../models/Product/vehicle"));
const Feature_1 = __importDefault(require("../models/Featured/Feature"));
const AdminLogs_1 = __importDefault(require("../models/LogModel/AdminLogs"));
const FeaturedLogs_1 = __importDefault(require("../models/LogModel/FeaturedLogs"));
const addAdminUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { adminName, adminEmail, adminPwd, addedBy } = req.body;
    const customId = (0, nanoid_1.customAlphabet)("1234567890", 4);
    const adminId = customId();
    try {
        const salt = yield bcryptjs_1.default.genSalt(5);
        const hashedPwd = yield bcryptjs_1.default.hash(adminPwd, salt);
        let user = new adminUser_1.default({
            adminName,
            adminEmail,
            adminPwd: hashedPwd,
            adminId: adminId,
            addedBy,
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
    let userData;
    try {
        if (!adminEmail || !adminPwd) {
            return res.status(400).json({ error: "fill all Fields" });
        }
        const user = yield adminUser_1.default.findOne({ adminEmail: adminEmail });
        if (!user) {
            return res.status(404).json({ error: "Email not found" });
        }
        const isPassword = yield bcryptjs_1.default.compare(adminPwd, user.adminPwd);
        if (!isPassword) {
            return res.status(400).json({ error: "Credentials not matched" });
        }
        if (!process.env.JWTSECRET) {
            return res.status(500).json({ error: "JWT_SECRET is not defined" });
        }
        const authToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWTSECRET, {
            expiresIn: "1h",
        });
        if (!authToken)
            return res.status(401).json({ error: "Failed" });
        // const userID = data.id;
        // const authToken = jwt.sign(userID, process.env.JWTSECRET as string);
        // res.cookie("authToken", authToken, {
        //   expires: new Date(Date.now() + 99999),
        // });
        userData = {
            adminEmail: adminEmail,
            role: user.adminRole,
            loginedId: user.adminEmail,
        };
        return res.status(200).json({
            message: "Login succssfully",
            authToken: authToken,
            userData: userData,
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
    const { updatedBy } = req.body;
    try {
        const business = yield business_1.default.findOne({ businessId: id });
        if (!business) {
            return res.status(404).json({ error: "Business not found" });
        }
        business.isActive = !business.isActive;
        const updatedBusiness = yield business.save();
        if (business.isActive) {
            status = "Activated";
            let adminLog = new AdminLogs_1.default({
                updatedBy: updatedBy,
                productId: id,
                action: "Activated",
                time: new Date(),
            });
            adminLog = yield adminLog.save();
            const veh = yield vehicle_1.default.updateMany({ businessId: id }, {
                $set: { isActive: true },
            });
            const tour = yield tour_1.default.updateMany({ businessId: id }, {
                $set: { isActive: true },
            });
            const trek = yield trekking_1.default.updateMany({ businessId: id }, {
                $set: { isActive: true },
            });
            const driver = yield Driver_1.default.updateMany({ businessId: id }, {
                $set: { isActive: true },
            });
        }
        else {
            status = "Deactivated";
            let adminLog = new AdminLogs_1.default({
                updatedBy: updatedBy,
                productId: id,
                action: "Deactivated",
                time: new Date(),
            });
            adminLog = yield adminLog.save();
            const veh = yield vehicle_1.default.updateMany({ businessId: id }, {
                $set: { isActive: false },
            });
            const tour = yield tour_1.default.updateMany({ businessId: id }, {
                $set: { isActive: false },
            });
            const trek = yield trekking_1.default.updateMany({ businessId: id }, {
                $set: { isActive: false },
            });
            const driver = yield Driver_1.default.updateMany({ businessId: id }, {
                $set: { isActive: false },
            });
        }
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: business.primaryEmail,
            subject: "Business Account Status ",
            html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://tourbackend-rdtk.onrender.com/public/uploads/logo.png' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Your Business Account Status</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              The status  of your Business account on toursewa is given below.
            </p>
            <p style="display: inline-block;   text-decoration: none;   font-size: 14px;">Your business account with business Id ${id} has been made ${status}. Also all the products of your business are made ${status == "Activated" ? "available" : "unavailable"}.</p>
          
          </div>
        </div>
      </div>`,
        });
        return res.status(200).json({
            message: `Business is ${status}`,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.businessApprove = businessApprove;
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
            html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://tourbackend-rdtk.onrender.com/public/uploads/logo.png' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Reset Your Password</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              Incase you forget your account password you can reset it here.
            </p>
            <a href='${url}' style="display: inline-block; background-color: #e6310b; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Click to Reset</a>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">
              This link will expire in 24 hours
            </p>
          </div>
        </div>
      </div>
    `,
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
    const customId = (0, nanoid_1.customAlphabet)("1234567890", 4);
    let businessId = customId();
    businessId = "B" + businessId;
    const { registrationNumber } = req.body.businessRegistration;
    const { country, state } = req.body.businessAddress;
    const { businessName, businessCategory, primaryEmail, primaryPhone, password, addedBy, } = req.body;
    try {
        if (password == "") {
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
        const userEmail = yield userModel_1.default.findOne({ email: primaryEmail });
        if (userEmail) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const driverEmail = yield Driver_1.default.findOne({ email: primaryEmail });
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
        let hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        let business = new business_1.default({
            businessName,
            businessCategory,
            businessRegistration: {
                registrationNumber,
            },
            businessAddress: {
                country,
                state,
            },
            primaryEmail,
            primaryPhone,
            businessId: businessId,
            password: hashedPassword,
            addedBy,
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
            html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://tourbackend-rdtk.onrender.com/public/uploads/logo.png' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Verify your Email address</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              To cointinue on Toursewa with your account, please verify that
              this is your email address.
            </p>
            <a href='${url}' style="display: inline-block; background-color: #e6310b; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Click to verify</a>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">
              This link will expire in 24 hours
            </p>
          </div>
        </div>
      </div>
    `,
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
    const newPwd = req.body.password;
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
        const isOldPwd = yield bcryptjs_1.default.compare(newPwd, businessId.password);
        if (isOldPwd) {
            return res.status(400).json({ error: "Password Previously Used" });
        }
        else {
            const salt = yield bcryptjs_1.default.genSalt(5);
            let hashedPwd = yield bcryptjs_1.default.hash(newPwd, salt);
            businessId.password = hashedPwd;
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
                        html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://tourbackend-rdtk.onrender.com/public/uploads/logo.png' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">New Business Account Registered</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
             A new business with business Id ${businessId.businessId} has been registered. You can verify and activate the account directly here.
            </p>
            <a href='${process.env.FRONTEND_URL}/businessapprove/${businessId.businessId}' style="display: inline-block; background-color: #e6310b; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Activate Account</a>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">
              This link will expire in 24 hours
            </p>
          </div>
        </div>
      </div>
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
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { updatedBy } = req.query;
    try {
        const deleteAdmin = yield adminUser_1.default.findByIdAndDelete(id);
        if (!deleteAdmin) {
            return res.status(404).json({ error: "Failed to delete" });
        }
        let adminLog = new AdminLogs_1.default({
            updatedBy: updatedBy,
            productId: id,
            action: "Deleted",
            time: new Date(),
        });
        adminLog = yield adminLog.save();
        return res.status(200).json({ message: "Successfully Deleted" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.deleteAdmin = deleteAdmin;
const getFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Feature_1.default.find().then((data) => {
            if (!data) {
                return res.status(400).json({ error: "Failed to get Feature" });
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
exports.getFeature = getFeature;
const addFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { updatedBy } = req.body;
    try {
        const data = (yield tour_1.default.findOne({ _id: id })) ||
            (yield trekking_1.default.findOne({ _id: id })) ||
            (yield vehicle_1.default.findOne({ _id: id }));
        if (!data) {
            return res.status(400).json({ error: "Not Found" });
        }
        data.isFeatured = "Yes";
        const updated = yield data.save();
        if (!updated) {
            return res.status(404).json({ error: "Failed" });
        }
        const feature = yield Feature_1.default.findOneAndUpdate({ Id: id }, {
            status: "Yes",
        }, { new: true });
        if (!feature) {
            return res.status(404).json({ error: "Not Found" });
        }
        let featureLog = new FeaturedLogs_1.default({
            updatedBy: updatedBy,
            productId: data.name,
            action: "Added To Feature",
            time: new Date(),
        });
        featureLog = yield featureLog.save();
        return res.status(200).json({ message: "Added to Features" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.addFeature = addFeature;
const deleteFeatureRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { updatedBy } = req.body;
    try {
        const product = (yield tour_1.default.findOne({ _id: id })) ||
            (yield trekking_1.default.findOne({ _id: id })) ||
            (yield vehicle_1.default.findOne({ _id: id }));
        if (!product) {
            return res.status(400).json({ error: "Product Not Found" });
        }
        const deleteFeature = yield Feature_1.default.findOneAndDelete({ Id: id });
        if (!deleteFeature) {
            return res.status(404).json({ error: "Failed to delete" });
        }
        product.isFeatured = "No";
        const updated = yield product.save();
        if (!updated) {
            return res.status(404).json({ error: "Failed" });
        }
        let featureLog = new FeaturedLogs_1.default({
            updatedBy: updatedBy,
            productId: id,
            action: "Feature Request Rejected",
            time: new Date(),
        });
        featureLog = yield featureLog.save();
        if (!featureLog) {
            return res.status(404).json({ error: "Rejected - Log files not saved" });
        }
        return res.status(200).json({ message: "Rejected" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.deleteFeatureRequest = deleteFeatureRequest;
const removeFeatureProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { updatedBy } = req.body;
    try {
        const deleteFeature = yield Feature_1.default.findOneAndDelete({ Id: id });
        if (!deleteFeature) {
            return res.status(404).json({ error: "Failed to delete" });
        }
        const data = (yield tour_1.default.findOne({ _id: id })) ||
            (yield trekking_1.default.findOne({ _id: id })) ||
            (yield vehicle_1.default.findOne({ _id: id }));
        if (!data) {
            return res.status(400).json({ error: "Failed" });
        }
        data.isFeatured = "No";
        const updated = yield data.save();
        if (!updated) {
            return res.status(404).json({ error: "Failed" });
        }
        let featureLog = new FeaturedLogs_1.default({
            updatedBy: updatedBy,
            productId: data.name,
            action: "Removed from Feature",
            time: new Date(),
        });
        featureLog = yield featureLog.save();
        return res.status(200).json({ message: "Removed from Featured Products" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.removeFeatureProduct = removeFeatureProduct;
const makePending = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { updatedBy } = req.body;
    try {
        const pending = yield Feature_1.default.findOne({ Id: id });
        if (!pending) {
            return res.status(401).json({ error: "Not Found" });
        }
        const data = (yield tour_1.default.findOne({ _id: id })) ||
            (yield trekking_1.default.findOne({ _id: id })) ||
            (yield vehicle_1.default.findOne({ _id: id }));
        if (!data) {
            return res.status(401).json({ error: "Failed" });
        }
        data.isFeatured = "Pending";
        const updated = yield data.save();
        if (!updated) {
            return res.status(404).json({ error: "Failed" });
        }
        const feature = yield Feature_1.default.findOneAndUpdate({ Id: id }, { status: "Pending" }, { new: true });
        if (!feature) {
            return res.status(404).json({ error: "Failed" });
        }
        let featureLog = new FeaturedLogs_1.default({
            updatedBy: updatedBy,
            productId: data.name,
            action: "Made Pending from Feature",
            time: new Date(),
        });
        featureLog = yield featureLog.save();
        return res.status(200).json({ message: "Removed from Featured Products" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.makePending = makePending;
