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
exports.resetPwd = exports.forgetPwd = exports.businessSignOut = exports.updateBusinessProfile = exports.getBusinessProfileDetails = exports.getBusinessProfile = exports.addbusinessProfile = exports.getBusiness = exports.businessProfile = exports.businessLogin = exports.addBusiness = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const business_1 = __importDefault(require("../models/business"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const businessProfine_1 = __importDefault(require("../models/businessProfine"));
const token_1 = __importDefault(require("../models/token"));
const uuid_1 = require("uuid");
const setEmail_1 = require("../utils/setEmail");
const addBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessName, businessCategory, taxRegistration, address, primaryEmail, primaryPhone, password, } = req.body;
    try {
        if (password == "") {
            return res.status(400).json({ error: "password is reqired" });
        }
        const tax = yield business_1.default.findOne({ taxRegistration });
        if (tax) {
            return res
                .status(400)
                .json({ error: "Registration Number is already Used" });
        }
        const email = yield business_1.default.findOne({ primaryEmail });
        if (email) {
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
            taxRegistration,
            address,
            primaryEmail,
            primaryPhone,
            password: hashedPassword,
        });
        business = yield business.save();
        if (!business) {
            hashedPassword = "";
            return res.status(400).json({ error: "Failed to save the business" });
        }
        else {
            hashedPassword = "";
            return res.status(200).json({ message: "Business Added succesfully" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.addBusiness = addBusiness;
const businessLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessId, primaryEmail, primaryPhone, password } = req.body;
    try {
        const businessid = yield business_1.default.findOne({ _id: businessId });
        if (!businessid) {
            return res.status(404).json({
                error: "Business Id not found",
                businessid: businessid,
            });
        }
        if (businessid.primaryEmail !== primaryEmail) {
            return res.status(400).json({
                error: "Email not matched",
                primaryEmail: primaryEmail,
                businessEmail: businessid.primaryEmail,
            });
        }
        const isPassword = yield bcryptjs_1.default.compare(password, businessid.password);
        if (!isPassword) {
            return res.status(400).json({ error: "password  not matched" });
        }
        if (businessid.primaryPhone !== primaryPhone) {
            return res.status(400).json({ error: "Phone number  not matched" });
        }
        const data = { id: businessid._id };
        const authToken = jsonwebtoken_1.default.sign(data, process.env.JWTSECRET);
        res.cookie("authToken", authToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 3600000,
        });
        return res.status(200).json({
            message: "Login succssfully",
            authToken: authToken,
            businesId: businessid._id,
            primaryEmail: primaryEmail,
            primaryPhone: primaryPhone,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.businessLogin = businessLogin;
const businessProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.businessId;
    try {
        const authToken = req.cookies.authToken;
        if (!authToken) {
            return res.status(400).json({ error: "Session Expired" });
        }
        const data = yield business_1.default.findById(id);
        if (!data) {
            return res.status(404).json({ error: "Failed to get business Profile" });
        }
        else {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.businessProfile = businessProfile;
const getBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield business_1.default.find().then((data) => {
            if (!data) {
                return res.status(400).json({ error: "Failed to get business" });
            }
            else {
                return res.send(data);
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.getBusiness = getBusiness;
const addbusinessProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authToken = req.cookies.authToken;
    if (!authToken) {
        return res
            .status(400)
            .json({ error: "Token not found, first login with business ID " });
    }
    const { businessSubcategory, Website, contactName } = req.body;
    const { Address, country, state, city } = req.body.businessAddress;
    const { authority, registrationNumber, registrationOn, expiresOn } = req.body.businessRegistration;
    const { platform } = req.body.socialMedia;
    try {
        const decodedToken = jsonwebtoken_1.default.verify(authToken, process.env.JWTSECRET);
        const businessId = decodedToken.id;
        const data = yield business_1.default.findOne({ _id: businessId });
        if (!data) {
            return res.status(400).json({
                error: "Failed to fetch Business Data",
                businessId: businessId,
            });
        }
        let imageGallery = [];
        let profileIcon = undefined;
        if (req.files) {
            const files = req.files;
            if (files["imageGallery"]) {
                imageGallery = files["imageGallery"].map((file) => file.path);
            }
            if (files["profileIcon"]) {
                profileIcon = (_a = files["profileIcon"][0]) === null || _a === void 0 ? void 0 : _a.path;
            }
        }
        const businessProfile = new businessProfine_1.default({
            businessId: data._id,
            businessName: data.businessName,
            businessCategory: data.businessCategory,
            businessSubcategory,
            businessAddress: {
                Address,
                country,
                state,
                city,
            },
            email: data.primaryEmail,
            Website,
            contactName,
            phone: data.primaryPhone,
            businessRegistration: {
                authority,
                registrationNumber,
                registrationOn,
                expiresOn,
            },
            socialMedia: {
                platform,
            },
            imageGallery,
            profileIcon,
        });
        const savedData = yield businessProfile.save();
        if (!savedData) {
            return res.status(400).json({ error: "failed to save" });
        }
        else {
            return res.send(savedData);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.addbusinessProfile = addbusinessProfile;
const getBusinessProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessId = req.params.businessId;
    try {
        const data = yield businessProfine_1.default.findOne({ businessId });
        if (!data) {
            return res
                .status(404)
                .json({ error: "Failed to get business full Profile" });
        }
        else {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getBusinessProfile = getBusinessProfile;
const getBusinessProfileDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield businessProfine_1.default.findById(id);
        if (!data) {
            return res
                .status(404)
                .json({ error: "Failed to get business Profile Data" });
        }
        else {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getBusinessProfileDetails = getBusinessProfileDetails;
const updateBusinessProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authToken = req.cookies.authToken;
    if (!authToken) {
        return res
            .status(400)
            .json({ error: "Token not found, first login with business ID " });
    }
    const id = req.params.id;
    try {
        const imageGallery = req.body.existingImageGallery || [];
        let profileIcon = undefined;
        if (req.files) {
            const files = req.files;
            if (files["imageGallery"]) {
                const uploadedFiles = files["imageGallery"].map((file) => file.path);
                imageGallery.push(...uploadedFiles);
            }
            if (files["profileIcon"]) {
                profileIcon = (_a = files["profileIcon"][0]) === null || _a === void 0 ? void 0 : _a.path;
            }
        }
        const data = yield businessProfine_1.default.findByIdAndUpdate(id, {
            businessId: req.body.businessId,
            businessName: req.body.businessName,
            businessCategory: req.body.businessCategory,
            businessSubcategory: req.body.businessSubcategory,
            businessAddress: {
                Address: req.body.businessAddress.Address,
                country: req.body.businessAddress.country,
                state: req.body.businessAddress.state,
                city: req.body.businessAddress.city,
            },
            email: req.body.email,
            Website: req.body.Website,
            contactName: req.body.contactName,
            phone: req.body.phone,
            businessRegistration: {
                authority: req.body.businessRegistration.authority,
                registrationNumber: req.body.businessRegistration.registrationNumber,
                registrationOn: req.body.businessRegistration.registrationOn,
                expiresOn: req.body.businessRegistration.expiresOn,
            },
            socialMedia: {
                platform: req.body.socialMedia.platform,
            },
            imageGallery,
            profileIcon,
        }, { new: true });
        if (!data) {
            return res.status(400).json({
                error: "failed",
            });
        }
        else {
            const newData = yield business_1.default.findByIdAndUpdate(req.body.businessId, {
                businessName: req.body.businessName,
                businessCategory: req.body.businessCategory,
                address: req.body.businessAddress.Address,
                primaryEmail: req.body.email,
                primaryPhone: req.body.phone,
            }, { new: true });
            return res.send({
                data: data,
                newData: newData,
            });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateBusinessProfile = updateBusinessProfile;
const businessSignOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = req.cookies.authToken;
    try {
        if (!authToken) {
            return res.status(400).json({ error: "signout request failed" });
        }
        res.clearCookie("authToken", {
            httpOnly: true,
            sameSite: "strict",
        });
        return res.status(200).json({ message: "Sign out successful" });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.businessSignOut = businessSignOut;
const forgetPwd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let primaryEmail = req.body.primaryEmail;
    try {
        const data = yield business_1.default.findOne({ primaryEmail });
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
        const url = `${process.env.FRONTEND_URL}/resetbusinesspwd/${token.token}`;
        const api = `${process.env.Backend_URL}`;
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: data.primaryEmail,
            subject: "Password Reset Link",
            text: `Reset password USing link below\n\n
    ${api}/resetbusinesspwd/${token.token}
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
    const newPwd = req.body.password;
    try {
        const data = yield token_1.default.findOne({ token });
        if (!data) {
            return res.status(404).json({ error: "Token not found" });
        }
        const businessId = yield business_1.default.findOne({ _id: data.userId });
        if (!businessId) {
            return res.status(404).json({ error: "Token and Email not matched" });
        }
        else {
            const salt = yield bcryptjs_1.default.genSalt(5);
            let hashedPwd = yield bcryptjs_1.default.hash(newPwd, salt);
            businessId.password = hashedPwd;
            businessId.save();
            yield token_1.default.deleteOne({ _id: data._id });
            return res.status(201).json({ message: "Reset Successful" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.resetPwd = resetPwd;
