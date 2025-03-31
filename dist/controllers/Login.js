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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
const createAuthToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWTSECRET, { expiresIn: "1h" });
};
const setAuthCookie = (res, authToken) => {
    res.cookie("authTOken", authToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 hour
    });
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, Pwd } = req.body;
    try {
        const user = (yield userModel_1.default.findOne({ userEmail: email })) ||
            (yield business_1.default.findOne({ primaryEmail: email })) ||
            (yield Driver_1.default.findOne({ driverEmail: email })) ||
            (yield businessManager_1.default.findOne({ email })) ||
            (yield Sales_1.default.findOne({ email }));
        if (!user) {
            return res.status(400).json({ error: "USer not found" });
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
        const authToken = createAuthToken(user._id.toString());
        setAuthCookie(res, authToken);
        const _a = user.toObject(), { password } = _a, UserData = __rest(_a, ["password"]);
        return res.status(200).json({
            message: "Login Successful",
            authToken,
            user: UserData,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
    // try {
    //   const userTypes = [
    //     {
    //       model: User,
    //       emailField: "userEmail",
    //       passwordField: "userPwd",
    //       extraFields: ["userId", "userRole", "userName"],
    //     },
    //     {
    //       model: Business,
    //       emailField: "primaryEmail",
    //       passwordField: "businessPwd",
    //       extraFields: ["bId", "businessRole", "businessName"],
    //       additionalChecks: { field: "isActive", error: "Account not Activated" },
    //     },
    //     {
    //       model: Driver,
    //       emailField: "driverEmail",
    //       passwordField: "driverPwd",
    //       extraFields: ["driverId", "driverName", "vehicleId"],
    //     },
    //     {
    //       model: BusinessManager,
    //       emailField: "email",
    //       passwordField: "password",
    //       extraFields: ["managerId"],
    //     },
    //     {
    //       model: Sales,
    //       emailField: "email",
    //       passwordField: "password",
    //       extraFields: ["salesId"],
    //     },
    //   ];
    //   for (const userType of userTypes) {
    //     const user = await userTypes.model.findOne({
    //       [userType.emailField]: email,
    //     });
    //     if (user) {
    //       const isPassword = await bcryptjs.compare(
    //         Pwd,
    //         user[userType.passwordField]
    //       );
    //       if (!isPassword)
    //         return res.status(401).json({ error: "Invalid Credentials" });
    //       if (user.isVerified === false)
    //         return res.status(401).json({ error: "Email not verified" });
    //       if (
    //         userType.additionalChecks &&
    //         user[userType.additionalChecks.field] === false
    //       ) {
    //         return res
    //           .status(400)
    //           .json({ error: userType.additionalChecks.error });
    //       }
    //       const authToken = createAuthToken(user._id.toString());
    //       setAuthCookie(res, authToken);
    //       const responseData: any = {
    //         message: "Login Successful",
    //         authToken,
    //         email,
    //         loginedId: user[userType.extraFields[0]],
    //       };
    //       userType.extraFields.forEach((field) => {
    //         responseData[field] = user[field];
    //       });
    //     }
    //   }
    //   const clientEmail = await User.findOne({
    //     userEmail: email,
    //   });
    //   if (clientEmail) {
    //     const isPassword = await bcryptjs.compare(Pwd, clientEmail.userPwd);
    //     if (!isPassword) {
    //       return res.status(400).json({ error: "Credentials not matched" });
    //     }
    //     const isVerified = clientEmail.isVerified;
    //     if (!isVerified) {
    //       return res.status(400).json({ error: "Email not Verified" });
    //     }
    //     const data = { id: clientEmail._id };
    //     const authToken = jwt.sign(data, process.env.JWTSECRET as string, {
    //       expiresIn: "1h",
    //     });
    //     res.cookie("authToken", authToken, {
    //       httpOnly: true,
    //       sameSite: "strict",
    //       maxAge: 3600000, // 1 hour
    //       secure: process.env.NODE_ENV === "production",
    //     });
    //     return res.status(200).json({
    //       message: "Login succssfully",
    //       authToken: authToken,
    //       userId: clientEmail.userId,
    //       clientId: clientEmail._id,
    //       userEmail: clientEmail.userEmail,
    //       userRole: clientEmail.userRole,
    //       userName: clientEmail.userName,
    //       loginedId: clientEmail.userId,
    //     });
    //   } else {
    //     const businessEmail = await Business.findOne({
    //       primaryEmail: email,
    //     });
    //     if (businessEmail) {
    //       const isPassword = await bcryptjs.compare(
    //         Pwd,
    //         businessEmail.businessPwd
    //       );
    //       if (!isPassword) {
    //         return res.status(400).json({ error: "Credentials not matched" });
    //       }
    //       const isVerified = businessEmail.isVerified;
    //       if (!isVerified) {
    //         return res.status(400).json({ error: "Email not Verified" });
    //       }
    //       const isActive = businessEmail.isActive;
    //       if (!isActive) {
    //         return res.status(400).json({ error: "Account not Activated" });
    //       }
    //       const data = { id: businessEmail._id };
    //       const authToken = jwt.sign(data, process.env.JWTSECRET as string, {
    //         expiresIn: "1h",
    //       });
    //       res.cookie("authToken", authToken);
    //       console.log("Cookie should be set:", authToken);
    //       return res.status(200).json({
    //         message: "Login succssfully",
    //         authToken: authToken,
    //         businesId: businessEmail._id,
    //         primaryEmail: businessEmail.primaryEmail,
    //         businessRole: businessEmail.businessRole,
    //         businessName: businessEmail.businessName,
    //         bId: businessEmail.bId,
    //         loginedId: businessEmail.bId,
    //       });
    //     } else {
    //       const driverEmail = await Driver.findOne({
    //         driverEmail: email,
    //       });
    //       if (driverEmail) {
    //         const isPassword = await bcryptjs.compare(Pwd, driverEmail.driverPwd);
    //         if (!isPassword) {
    //           return res.status(400).json({ error: "Credentials not matched" });
    //         }
    //         const isVerified = driverEmail.isVerified;
    //         if (!isVerified) {
    //           return res.status(400).json({ error: "Email not Verified" });
    //         }
    //         const data = { id: email._id };
    //         const authToken = jwt.sign(data, process.env.JWTSECRET as string, {
    //           expiresIn: "1h",
    //         });
    //         res.cookie("authToken", authToken, {
    //           httpOnly: true,
    //           sameSite: "strict",
    //           maxAge: 3600000, // 1 hour
    //           secure: process.env.NODE_ENV === "production",
    //         });
    //         return res.status(200).json({
    //           message: "Login succssfull",
    //           authToken: authToken,
    //           driver_id: driverEmail._id,
    //           driverId: driverEmail.driverId,
    //           driverEmail: driverEmail.driverEmail,
    //           driverName: driverEmail.driverName,
    //           vehicleId: driverEmail.vehicleId,
    //           loginedId: driverEmail.driverId,
    //         });
    //       } else {
    //         const managerEmail = await BusinessManager.findOne({
    //           email: email,
    //         });
    //         if (managerEmail) {
    //           const isPassword = await bcryptjs.compare(
    //             Pwd,
    //             managerEmail.password
    //           );
    //           if (!isPassword) {
    //             return res.status(400).json({ error: "Credentials not matched" });
    //           }
    //           const data = { id: email._id };
    //           const authToken = jwt.sign(data, process.env.JWTSECRET as string, {
    //             expiresIn: "1h",
    //           });
    //           res.cookie("authToken", authToken, {
    //             httpOnly: true,
    //             sameSite: "strict",
    //             maxAge: 3600000,
    //           });
    //           return res.status(200).json({
    //             message: ":Login Successfull",
    //             authToken: authToken,
    //             email: email,
    //             managerId: managerEmail.managerId,
    //           });
    //         } else {
    //           const salesEmail = await Sales.findOne({
    //             email: email,
    //           });
    //           if (salesEmail) {
    //             const isPassword = await bcryptjs.compare(
    //               Pwd,
    //               salesEmail.password
    //             );
    //             if (!isPassword) {
    //               return res
    //                 .status(400)
    //                 .json({ error: "Credentials not matched" });
    //             }
    //             const data = { id: email._id };
    //             const authToken = jwt.sign(
    //               data,
    //               process.env.JWTSECRET as string,
    //               {
    //                 expiresIn: "1h",
    //               }
    //             );
    //             res.cookie("authToken", authToken, {
    //               httpOnly: true,
    //               sameSite: "strict",
    //               maxAge: 3600000,
    //             });
    //             return res.status(200).json({
    //               message: ":Login Successfull",
    //               authToken: authToken,
    //               email: email,
    //               salesId: salesEmail.salesId,
    //             });
    //           }
    //           return res.status(400).json({ error: "Data not found" });
    //         }
    //       }
    //     }
    //   }
    // } catch (error: any) {
    //   return res.status(500).json({ error: error.message });
    // }
});
exports.login = login;
