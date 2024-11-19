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
exports.resetPwd = exports.forgetPwd = exports.businessSignOut = exports.deleteBusiness = exports.updateBusinessProfile = exports.getBusiness = exports.businessProfile = exports.businessLogin = exports.verifyEmail = exports.addBusiness = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const business_1 = __importDefault(require("../models/business"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import BusinessProfile from "../models/businessProfine";
const token_1 = __importDefault(require("../models/token"));
const uuid_1 = require("uuid");
const setEmail_1 = require("../utils/setEmail");
const { customAlphabet } = require("nanoid");
const addBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customId = customAlphabet("1234567890", 4);
    const bId = customId();
    const { registrationNumber } = req.body.businessRegistration;
    const { address } = req.body.businessAddress;
    const { businessName, businessCategory, primaryEmail, primaryPhone, businessPwd, } = req.body;
    try {
        if (businessPwd == "") {
            return res.status(400).json({ error: "Password is reqired" });
        }
        const tax = yield business_1.default.findOne({
            registrationNumber,
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
                address,
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
        const url = `${process.env.FRONTEND_URL}/verifybusinessemail/${token.token}`;
        const api = `${process.env.Backend_URL}`;
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: business.primaryEmail,
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
exports.addBusiness = addBusiness;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
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
        businessId.isVerified = true;
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
                return res.status(200).json({ message: "Email Verified" });
            }
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.verifyEmail = verifyEmail;
const businessLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { primaryEmail, businessPwd } = req.body;
    try {
        const businessEmail = yield business_1.default.findOne({
            primaryEmail: primaryEmail,
        });
        if (!businessEmail) {
            return res.status(404).json({
                error: "Email not found",
            });
        }
        const isPassword = yield bcryptjs_1.default.compare(businessPwd, businessEmail.businessPwd);
        if (!isPassword) {
            return res.status(400).json({ error: "Incorrect Password" });
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
            primaryEmail: primaryEmail,
            businessRole: primaryEmail.businessRole,
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
        // const authToken = req.cookies.authToken;
        // if (!authToken) {
        //   return res.status(400).json({ error: "Session Expired" });
        // }
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
            if (data.length > 0) {
                return res.send(data);
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.getBusiness = getBusiness;
// export const addbusinessProfile = async (req: Request, res: Response) => {
//   const businessId = req.params.businessid;
//   const authToken = req.cookies.authToken;
//   // if (!authToken) {
//   //   return res
//   //     .status(400)
//   //     .json({ error: "Token not found, first login with business ID " });
//   // }
//   const { businessSubcategory, website, contactName } = req.body;
//   const { address, country, state, city } = req.body.businessAddress;
//   const { authority, registrationNumber, registrationOn, expiresOn } =
//     req.body.businessRegistration;
//   const { platform } = req.body.socialMedia;
//   try {
//     // const decodedToken = jwt.verify(
//     //   authToken,
//     //   process.env.JWTSECRET as string
//     // ) as { id: string };
//     // const businessId = decodedToken.id;
//     const data = await Business.findOne({ _id: businessId });
//     if (!data) {
//       return res.status(400).json({
//         error: "Business ID not found",
//         businessId: businessId,
//       });
//     }
//     let imageGallery: string[] = [];
//     let profileIcon: string | undefined = undefined;
//     if (req.files) {
//       const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//       if (files["imageGallery"]) {
//         imageGallery = files["imageGallery"].map((file) => file.path);
//       }
//       if (files["profileIcon"]) {
//         profileIcon = files["profileIcon"][0]?.path;
//       }
//     }
//     const businessProfile = new BusinessProfile({
//       businessId: data._id,
//       businessName: data.businessName,
//       businessCategory: data.businessCategory,
//       businessSubcategory,
//       businessAddress: {
//         address,
//         country,
//         state,
//         city,
//       },
//       email: data.primaryEmail,
//       website,
//       contactName,
//       phone: data.primaryPhone,
//       businessRegistration: {
//         authority,
//         registrationNumber,
//         registrationOn,
//         expiresOn,
//       },
//       socialMedia: {
//         platform,
//       },
//       imageGallery,
//       profileIcon,
//     });
//     const savedData = await businessProfile.save();
//     if (!savedData) {
//       return res.status(400).json({ error: "failed to save" });
//     } else {
//       return res.send(savedData);
//     }
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// };
// export const getBusinessProfile = async (req: Request, res: Response) => {
//   const businessId = req.params.businessId;
//   try {
//     const businessData = await Business.findOne({ _id: businessId });
//     if (!businessData) {
//       const data = await BusinessProfile.findOne({ businessId: businessId });
//       if (!data) {
//         return res.status(404).json({ error: "Data Not Found" });
//       } else {
//         return res.send(data);
//       }
//     } else {
//       return res.send(businessData);
//     }
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// };
// export const getBusinessProfileDetails = async (
//   req: Request,
//   res: Response
// ) => {
//   const id = req.params.id;
//   try {
//     const data = await BusinessProfile.findById(id);
//     if (!data) {
//       return res
//         .status(404)
//         .json({ error: "Failed to get business Profile Data" });
//     } else {
//       return res.send(data);
//     }
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// };
const updateBusinessProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // const authToken = req.cookies.authToken;
    // if (!authToken) {
    //   return res
    //     .status(400)
    //     .json({ error: "Token not found, first login with business ID " });
    // }
    const id = req.params.businessid;
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
        const data = yield business_1.default.findByIdAndUpdate(id, {
            // businessId: req.body.businessId,
            businessName: req.body.businessName,
            businessCategory: req.body.businessCategory,
            businessSubcategory: req.body.businessSubcategory,
            businessAddress: {
                address: req.body.businessAddress.address,
                country: req.body.businessAddress.country,
                state: req.body.businessAddress.state,
                city: req.body.businessAddress.city,
            },
            primaryEmail: req.body.primaryEmail,
            website: req.body.website,
            contactName: req.body.contactName,
            primaryPhone: req.body.primaryPhone,
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
                error: "Failed to Update",
            });
        }
        else {
            // const newData = await Business.findByIdAndUpdate(
            //   req.body.businessId,
            //   {
            //     businessName: req.body.businessName,
            //     businessCategory: req.body.businessCategory,
            //     address: req.body.businessAddress.Address,
            //     primaryEmail: req.body.email,
            //     primaryPhone: req.body.phone,
            //   },
            //   { new: true }
            // );
            return res.send({
                message: "Updated",
                data: data,
                // newData: newData,
            });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateBusinessProfile = updateBusinessProfile;
const deleteBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const deleteBusiness = yield business_1.default.findByIdAndDelete(id);
        if (!deleteBusiness) {
            return res.status(404).json({ error: "Failed to delete" });
        }
        // const deletedBusinessProfile = await BusinessProfile.findOneAndDelete({
        //   businessId: id,
        // });
        // if (!deletedBusinessProfile) {
        //   return res
        //     .status(404)
        //     .json({ error: "Failed to delete associated business profile" });
        // }
        return res.status(200).json({ message: "Successfully Deleted" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.deleteBusiness = deleteBusiness;
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
    const newPwd = req.body.businessPwd;
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
            businessId.businessPwd = hashedPwd;
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
