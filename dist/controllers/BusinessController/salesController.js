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
exports.updateBusinessSales = exports.getBusinessSales = exports.addSales = void 0;
const businessManager_1 = __importDefault(require("../../models/Business/businessManager"));
const setEmail_1 = require("../../utils/setEmail");
const nanoid_1 = require("nanoid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cloudinary_1 = require("cloudinary");
const Driver_1 = __importDefault(require("../../models/Business/Driver"));
const userModel_1 = __importDefault(require("../../models/User/userModel"));
const business_1 = __importDefault(require("../../models/Business/business"));
const Sales_1 = __importDefault(require("../../models/Business/Sales"));
cloudinary_1.v2.config({
    cloud_name: "dwepmpy6w",
    api_key: "934775798563485",
    api_secret: "0fc2bZa8Pv7Vy22Ji7AhCjD0ErA",
});
const addSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const customId = (0, nanoid_1.customAlphabet)("1234567890", 4);
    let salesId = customId();
    salesId = "S" + salesId;
    const { businessId, name, email, password } = req.body;
    try {
        const driver = yield Driver_1.default.findOne({ email });
        if (driver) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const managerEmail = yield businessManager_1.default.findOne({ email });
        if (managerEmail) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const client = yield userModel_1.default.findOne({ email });
        if (client) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const businessData = yield business_1.default.findOne({ businessId });
        if (!businessData) {
            return res.status(400).json({ error: "Business Not Found" });
        }
        const emailCheck = yield business_1.default.findOne({
            primaryEmail: { $ne: businessData.primaryEmail },
            $or: [{ primaryEmail: email }],
        });
        if (emailCheck) {
            return res.status(400).json({ error: "Email already Registered" });
        }
        const salt = yield bcryptjs_1.default.genSalt(5);
        let hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        if (!hashedPassword) {
            return res.status(400).json({ error: "Failed to save password " });
        }
        let image = undefined;
        if (req.files) {
            const files = req.files;
            if (files["image"]) {
                const result = yield cloudinary_1.v2.uploader.upload((_a = files["image"][0]) === null || _a === void 0 ? void 0 : _a.path, {
                    folder: "SalesImage",
                    use_filename: true,
                    unique_filename: false,
                });
                image = result.secure_url;
            }
            let newSales = new Sales_1.default({
                businessId,
                name,
                email,
                password: hashedPassword,
                image,
            });
            newSales = yield newSales.save();
            if (!newSales) {
                return res.status(400).json({ error: "Failed" });
            }
            (0, setEmail_1.sendEmail)({
                from: "beta.toursewa@gmail.com",
                to: businessData.primaryEmail,
                subject: "New Manager Added",
                html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://asset.cloudinary.com/dwepmpy6w/7b4489e2ccf4981edf7a8ead0976f935' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Verify your Email address</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              A new Sales User to the business ${businessData.businessName} with name ${name} is added. 
            </p>
          </div>
        </div>
      </div> `,
            });
        }
    }
    catch (_b) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.addSales = addSales;
const getBusinessSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield Sales_1.default.find({ businessId: id });
        if (data.length === 0) {
            return res.status(404).json({ error: "Not Found" });
        }
        return res.send(data);
    }
    catch (_a) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getBusinessSales = getBusinessSales;
const updateBusinessSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const businessId = req.params.id;
    const { name, email, role } = req.body;
    try {
        let image = undefined;
        if (req.files) {
            const files = req.files;
            if (files["image"]) {
                const result = yield cloudinary_1.v2.uploader.upload((_a = files["image"][0]) === null || _a === void 0 ? void 0 : _a.path, {
                    folder: "salesImage",
                    use_filename: true,
                    unique_filename: false,
                });
                image = result.secure_url;
            }
        }
        const data = yield Sales_1.default.findOneAndUpdate({ businessId }, {
            name,
            email,
            role,
            image,
        }, { new: true });
        if (!data) {
            return res.status(404).json({ error: "Failed to Updated" });
        }
        return res.status(200).json({ message: "Updated" });
    }
    catch (_b) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.updateBusinessSales = updateBusinessSales;
