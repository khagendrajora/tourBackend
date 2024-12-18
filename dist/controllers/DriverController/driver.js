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
exports.resetPwd = exports.updateDriver = exports.deleteDriver = exports.getDriverById = exports.getDriverByVehId = exports.getDriverByBId = exports.getDrivers = exports.updateDriverStatus = exports.verifyDriverEmail = exports.addDriver = void 0;
const Driver_1 = __importDefault(require("../../models/Drivers/Driver"));
const token_1 = __importDefault(require("../../models/token"));
const uuid_1 = require("uuid");
const setEmail_1 = require("../../utils/setEmail");
const { customAlphabet } = require("nanoid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// import jwt from "jsonwebtoken";
const business_1 = __importDefault(require("../../models/business"));
const adminUser_1 = __importDefault(require("../../models/adminUser"));
const userModel_1 = __importDefault(require("../../models/User/userModel"));
const addDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const customId = customAlphabet("1234567890", 4);
    let driverId = customId();
    driverId = "D" + driverId;
    const { driverName, vehicleName, driverAge, driverPhone, driverEmail, vehicleId, businessId, driverPwd, } = req.body;
    try {
        let driverImage = undefined;
        if (req.files) {
            const files = req.files;
            if (files["driverImage"]) {
                driverImage = (_a = files["driverImage"][0]) === null || _a === void 0 ? void 0 : _a.path;
            }
        }
        const driverNumber = yield Driver_1.default.findOne({ driverPhone });
        if (driverNumber) {
            return res.status(400).json({ error: "Phone Number is already used " });
        }
        const driver = yield Driver_1.default.findOne({ driverEmail });
        if (driver) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const email = yield userModel_1.default.findOne({ userEmail: driverEmail });
        if (email) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const businessEmail = yield business_1.default.findOne({ primaryEmail: driverEmail });
        if (businessEmail) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const adminEmail = yield adminUser_1.default.findOne({ adminEmail: driverEmail });
        if (adminEmail) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const salt = yield bcryptjs_1.default.genSalt(5);
        let hashedPassword = yield bcryptjs_1.default.hash(driverPwd, salt);
        let newDriver = new Driver_1.default({
            driverId: driverId,
            vehicleId: vehicleId,
            vehicleName: vehicleName,
            businessId: businessId,
            driverEmail: driverEmail,
            driverName: driverName,
            driverAge: driverAge,
            driverPhone: driverPhone,
            driverPwd: hashedPassword,
            driverImage,
        });
        newDriver = yield newDriver.save();
        if (!newDriver) {
            return res.status(400).json({ error: "Failed" });
        }
        let token = new token_1.default({
            token: (0, uuid_1.v4)(),
            userId: newDriver._id,
        });
        token = yield token.save();
        if (!token) {
            return res.status(400).json({ error: "Token not generated" });
        }
        const url = `${process.env.FRONTEND_URL}/verifydriveremail/${token.token}`;
        const api = `${process.env.Backend_URL}`;
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: driverEmail,
            subject: "Account Verification Link",
            text: `Verify your Driver Email to Login\n\n
${api}/verifydriveremail/${token.token}`,
            html: `<h1>Click to Verify Email</h1> 
    <a href='${url}'>Click here To verify</a>`,
        });
        return res.status(200).json({ message: "Verification link send" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.addDriver = addDriver;
const verifyDriverEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    try {
        const data = yield token_1.default.findOne({ token });
        if (!data) {
            return res.status(404).json({ error: "Token Expired" });
        }
        const driverId = yield Driver_1.default.findOne({ _id: data.userId });
        if (!driverId) {
            return res.status(404).json({ error: "Token and Email not matched" });
        }
        if (driverId.isVerified) {
            return res.status(400).json({ error: "Email Already verified" });
        }
        driverId.isVerified = true;
        driverId.save().then((driver) => {
            if (!driver) {
                return res.status(400).json({ error: "Failed to Verify" });
            }
            else {
                (0, setEmail_1.sendEmail)({
                    from: "beta.toursewa@gmail.com",
                    to: driverId.driverEmail,
                    subject: "Email Verified",
                    html: `<h2>Your Email with business ID ${driverId.businessId} for vehicle ${driverId.vehicleId} has been verified</h2>`,
                });
                return res.status(200).json({ message: "Email Verified" });
            }
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.verifyDriverEmail = verifyDriverEmail;
// export const driverLogin = async (req: Request, res: Response) => {
//   const { driverEmail, driverPwd } = req.body;
//   try {
//     const email = await Driver.findOne({
//       driverEmail: driverEmail,
//     });
//     if (!email) {
//       return res.status(404).json({
//         error: "Email not found",
//       });
//     }
//     const isPassword = await bcryptjs.compare(driverPwd, email.driverPwd);
//     if (!isPassword) {
//       return res.status(400).json({ error: "Incorrect Password" });
//     }
//     const isVerified = email.isVerified;
//     if (!isVerified) {
//       return res.status(400).json({ error: "Email not Verified" });
//     }
//     const data = { id: email._id };
//     const authToken = jwt.sign(data, process.env.JWTSECRET as string);
//     res.cookie("authToken", authToken, {
//       httpOnly: true,
//       sameSite: "strict",
//       maxAge: 3600000,
//     });
//     return res.status(200).json({
//       message: "Login succssfully",
//       authToken: authToken,
//       driver_id: email._id,
//       driverId: email.driverId,
//       driverEmail: email.driverEmail,
//       driverName: email.driverName,
//     });
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// };
const updateDriverStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { status, driverEmail } = req.body;
    try {
        const data = yield Driver_1.default.findByIdAndUpdate(id, {
            status: status,
        }, { new: true });
        if (!data) {
            return res.status(400).json({ error: "Update Failed" });
        }
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: driverEmail,
            subject: "Status Changedd",
            html: `<h2>Your Status has been changed to ${status}</h2>`,
        });
        return res.status(200).json({ message: status });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateDriverStatus = updateDriverStatus;
const getDrivers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Driver_1.default.find().then((data) => {
            if (data.length > 0) {
                return res.send(data);
            }
            else {
                return res.status(200).json({ message: "Not Found" });
            }
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getDrivers = getDrivers;
const getDriverByBId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield Driver_1.default.find({ businessId: id });
        if (data.length === 0) {
            return res.status(400).json({ error: "No driver Found" });
        }
        else {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getDriverByBId = getDriverByBId;
const getDriverByVehId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield Driver_1.default.find({ vehicleId: id });
        if (data.length === 0) {
            return res.status(400).json({ error: "No  Data" });
        }
        else {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getDriverByVehId = getDriverByVehId;
const getDriverById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield Driver_1.default.findById(id);
        if (!data) {
            return res.status(400).json({ error: "Failed to Get" });
        }
        else {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getDriverById = getDriverById;
const deleteDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const deleteDriver = yield Driver_1.default.findByIdAndDelete(id);
        if (!deleteDriver) {
            return res.status(404).json({ error: "Failed to delete" });
        }
        return res.status(200).json({ message: "Successfully Deleted" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.deleteDriver = deleteDriver;
const updateDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const { driverName, driverAge, driverPhone, driverEmail, vehicleId, businessId, } = req.body;
    try {
        let driverImage = undefined;
        if (req.files) {
            const files = req.files;
            if (files["driverImage"]) {
                driverImage = (_a = files["driverImage"][0]) === null || _a === void 0 ? void 0 : _a.path;
            }
        }
        const data = yield Driver_1.default.findByIdAndUpdate(id, {
            driverName,
            driverAge,
            driverPhone,
            driverEmail,
            vehicleId,
            businessId,
            driverImage,
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
exports.updateDriver = updateDriver;
const resetPwd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const newPwd = req.body.driverPwd;
    try {
        const data = yield token_1.default.findOne({ token });
        if (!data) {
            return res.status(404).json({ error: "Token not found" });
        }
        const driverId = yield Driver_1.default.findOne({ _id: data.userId });
        if (!driverId) {
            return res.status(404).json({ error: "Token and Email not matched" });
        }
        const isOldPwd = yield bcryptjs_1.default.compare(newPwd, driverId.driverPwd);
        if (isOldPwd) {
            return res.status(400).json({ error: "Password Previously Used" });
        }
        else {
            const salt = yield bcryptjs_1.default.genSalt(5);
            let hashedPwd = yield bcryptjs_1.default.hash(newPwd, salt);
            driverId.driverPwd = hashedPwd;
            driverId.save();
            yield token_1.default.deleteOne({ _id: data._id });
            return res.status(201).json({ message: "Reset Successful" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.resetPwd = resetPwd;
