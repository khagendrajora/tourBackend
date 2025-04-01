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
exports.featureRequest = exports.resetPwd = exports.forgetPwd = exports.businessSignOut = exports.deleteBusiness = exports.updateBusinessProfile = exports.getBusiness = exports.businessProfile = exports.verifyEmail = exports.addBusiness = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const business_1 = __importDefault(require("../../models/Business/business"));
const Driver_1 = __importDefault(require("../../models/Business/Driver"));
const adminUser_1 = __importDefault(require("../../models/adminUser"));
const token_1 = __importDefault(require("../../models/token"));
const uuid_1 = require("uuid");
const setEmail_1 = require("../../utils/setEmail");
const userModel_1 = __importDefault(require("../../models/User/userModel"));
const { customAlphabet } = require("nanoid");
const Feature_1 = __importDefault(require("../../models/Featured/Feature"));
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: "dwepmpy6w",
    api_key: "934775798563485",
    api_secret: "0fc2bZa8Pv7Vy22Ji7AhCjD0ErA",
});
const addBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customId = customAlphabet("1234567890", 4);
    let businessId = customId();
    businessId = "B" + businessId;
    const { registrationNumber } = req.body.businessRegistration;
    const { country, state } = req.body.businessAddress;
    const { businessName, businessCategory, primaryEmail, primaryPhone, password, } = req.body;
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
            addedBy: businessId,
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
            subject: "Email Verification Link",
            text: `Verify your Business Email to Login\n\n
${api}/verifybusinessemail/${token.token}`,
            html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://tourbackend-rdtk.onrender.com/public/uploads/logo.png' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Verify your Email address</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              To continue on Toursewa with your account, please verify that
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
            .json({ message: "Verifying link is sent to Your Email" });
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
                    html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://tourbackend-rdtk.onrender.com/public/uploads/logo.png' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">A new business with business Id ${businessId} has been registered</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              Please verify and activate the account from the admin side or activate directly from here.
            </p>
            <a href='${process.env.FRONTEND_URL}/businessapprove/${businessId}' style="display: inline-block; background-color: #e6310b; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Verify and activate the account</a>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">
              This link will expire in 24 hours
            </p>
          </div>
        </div>
      </div> 
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
const businessProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.businessId;
    try {
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
            else {
                return res.status(400).json({ error: "Not Found" });
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.getBusiness = getBusiness;
const updateBusinessProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.businessid;
    try {
        let imageGallery = req.body.existingImageGallery
            ? [...req.body.existingImageGallery]
            : [];
        let profileIcon = undefined;
        if (req.files) {
            const files = req.files;
            if (files["imageGallery"]) {
                const uploadedFiles = yield Promise.all(files["imageGallery"].map((file) => __awaiter(void 0, void 0, void 0, function* () {
                    const result = yield cloudinary_1.v2.uploader.upload(file.path, {
                        folder: "businessImages",
                        use_filename: true,
                        unique_filename: false,
                    });
                    return result.secure_url;
                })));
                imageGallery.push(...uploadedFiles);
            }
            if (files["profileIcon"]) {
                const result = yield cloudinary_1.v2.uploader.upload(files["profileIcon"][0].path, {
                    folder: "businessIcons",
                    use_filename: true,
                    unique_filename: false,
                });
                profileIcon = result.secure_url;
                // profileIcon = files["profileIcon"][0]?.path;
            }
        }
        const data = yield business_1.default.findByIdAndUpdate(id, {
            businessSubCategory: req.body.businessSubCategory,
            businessAddress: {
                street: req.body.businessAddress.street,
                city: req.body.businessAddress.city,
            },
            website: req.body.website,
            contactName: req.body.contactName,
            primaryPhone: req.body.primaryPhone,
            businessRegistration: {
                authority: req.body.businessRegistration.authority,
                registrationOn: req.body.businessRegistration.registrationOn,
                expiresOn: req.body.businessRegistration.expiresOn,
            },
            socialMedia: {
                platform: req.body.socialMedia.platform,
                url: req.body.socialMedia.url,
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
            return res.send({
                message: "Updated",
                data: data,
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
    const email = req.body.email;
    try {
        const businessEmail = yield business_1.default.findOne({
            primaryEmail: email,
        });
        if (businessEmail) {
            let token = new token_1.default({
                token: (0, uuid_1.v4)(),
                userId: businessEmail._id,
            });
            token = yield token.save();
            if (!token) {
                return res.status(400).json({ error: "Token not generated" });
            }
            const url = `${process.env.FRONTEND_URL}/resetpassword/${token.token}`;
            const api = `${process.env.Backend_URL}`;
            (0, setEmail_1.sendEmail)({
                from: "beta.toursewa@gmail.com",
                to: businessEmail.primaryEmail,
                subject: "Password Reset Link",
                text: `Reset password USing link below\n\n
    ${api}/resetpassword/${token.token}
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
      </div> `,
            });
            return res
                .status(200)
                .json({ message: "Password reset link sent to your email" });
        }
        else {
            const data = yield userModel_1.default.findOne({ email: email });
            if (data) {
                let token = new token_1.default({
                    token: (0, uuid_1.v4)(),
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
                    to: data.email,
                    subject: "Password Reset Link",
                    text: `Reset password Using link below\n\n
      ${api}/resetuserpwd/${token.token}
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
      </div>`,
                });
                return res
                    .status(200)
                    .json({ message: "Password reset link sent to your email" });
            }
            else {
                const driver = yield Driver_1.default.findOne({ email: email });
                if (driver) {
                    let token = new token_1.default({
                        token: (0, uuid_1.v4)(),
                        userId: driver._id,
                    });
                    token = yield token.save();
                    if (!token) {
                        return res.status(400).json({ error: "Token not generated" });
                    }
                    const url = `${process.env.FRONTEND_URL}/resetdriverpwd/${token.token}`;
                    const api = `${process.env.Backend_URL}`;
                    (0, setEmail_1.sendEmail)({
                        from: "beta.toursewa@gmail.com",
                        to: driver.email,
                        subject: "Password Reset Link",
                        text: `Reset password USing link below\n\n
    ${api}/resetdriverpwd/${token.token}
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
      </div>`,
                    });
                    return res
                        .status(200)
                        .json({ message: "Password reset link sent to your email" });
                }
            }
        }
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
        const isOldPwd = yield bcryptjs_1.default.compare(newPwd, businessId.password);
        if (isOldPwd) {
            return res.status(400).json({ error: "Password Previously Used" });
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
const featureRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { businessName, name, productId, price } = req.body;
    try {
        let data = new Feature_1.default({
            Id: id,
            businessName,
            name,
            productId,
            price,
        });
        data = yield data.save();
        if (!data) {
            return res.status(400).json({ error: "Request Failed" });
        }
        return res.status(200).json({ message: "Request Send" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.featureRequest = featureRequest;
