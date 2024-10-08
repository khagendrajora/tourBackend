"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = exports.reservationData = exports.addPropertyData = exports.addSubCategoryData = exports.addCategoryData = exports.addBusinessProfileData = exports.addBusinessData = exports.adminSignup = void 0;
const express_validator_1 = require("express-validator");
exports.adminSignup = [
    (0, express_validator_1.check)("adminName").trim().notEmpty().withMessage("Admin Name is required"),
    (0, express_validator_1.check)("Email", "Email is required").trim().notEmpty().isEmail(),
    (0, express_validator_1.check)("Pwd", "Password is required")
        .trim()
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Pwd length must be mininum 8"),
    (0, express_validator_1.check)("cPwd", "CPassword not matched").trim().notEmpty(),
];
exports.addBusinessData = [
    (0, express_validator_1.check)("businessName", "Give Your Business Name").trim().notEmpty(),
    (0, express_validator_1.check)("taxRegistration", "Invalid Tax Registration").trim().notEmpty(),
    (0, express_validator_1.check)("address", "Provide Address").trim().notEmpty(),
    (0, express_validator_1.check)("primaryEmail", "Email is required")
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage("Invalid Email"),
    (0, express_validator_1.check)("primaryPhone", "Phone Number is required").trim().notEmpty(),
    (0, express_validator_1.check)("password", "password is required")
        .trim()
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("password length must be 8"),
];
exports.addBusinessProfileData = [
    (0, express_validator_1.check)("businessAddress[Address]", "Address is required").trim().notEmpty(),
    (0, express_validator_1.check)("businessAddress[country]", "Country is required").trim().notEmpty(),
    (0, express_validator_1.check)("businessAddress[city]", "City is required").trim().notEmpty(),
    (0, express_validator_1.check)("businessAddress[state]", "State is required").trim().notEmpty(),
    (0, express_validator_1.check)("businessRegistration[authority]", "Authority is required")
        .trim()
        .notEmpty(),
    (0, express_validator_1.check)("businessRegistration[registrationNumber]", "Registration Number is required")
        .trim()
        .notEmpty(),
    (0, express_validator_1.check)("businessRegistration[registrationOn]", "Registration Date is required")
        .trim()
        .notEmpty()
        .isDate()
        .withMessage("Invalid Date"),
    (0, express_validator_1.check)("businessRegistration[expiresOn]", "Expiery Date is required")
        .trim()
        .notEmpty()
        .isDate()
        .withMessage("Invalid Date"),
    (0, express_validator_1.check)("contactName", "Contact Name is required").trim().notEmpty(),
];
exports.addCategoryData = [
    (0, express_validator_1.check)("categoryName", "Category is required").trim().notEmpty(),
];
exports.addSubCategoryData = [
    (0, express_validator_1.check)("subCategoryName", "Sub Category is required").trim().notEmpty(),
];
exports.addPropertyData = [
    (0, express_validator_1.check)("PropName", "Property name is required").trim().notEmpty(),
    (0, express_validator_1.check)("PropCategory", "Sub Category is required").trim().notEmpty(),
    (0, express_validator_1.check)("Email", "Provide Email")
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage("Invalid Email"),
    (0, express_validator_1.check)("Phone", "Phone is required").trim().notEmpty(),
    (0, express_validator_1.check)("BusinessReg", "BusinessReg  is required").trim().notEmpty(),
    (0, express_validator_1.check)("Tax", "Tax  is required").trim().notEmpty(),
    (0, express_validator_1.check)("ContactName", "Contact name  is required").trim().notEmpty(),
    (0, express_validator_1.check)("ContactPhone", "Contact Phone  is required").trim().notEmpty(),
    (0, express_validator_1.check)("DateOfEstab", "Date of Estb. is required")
        .trim()
        .notEmpty()
        .isDate()
        .withMessage("Invalid Date"),
];
exports.reservationData = [
    (0, express_validator_1.check)("passenger_name", "Provide Passenger Name").trim().notEmpty(),
    (0, express_validator_1.check)("age", "Provide Age")
        .trim()
        .notEmpty()
        .isInt()
        .withMessage("Age must be number"),
    (0, express_validator_1.check)("email", "Provide Email")
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage("Invalid Email"),
    (0, express_validator_1.check)("phone", "Phone is required").trim().notEmpty(),
    (0, express_validator_1.check)("sourceAdd", "Provide Source Address")
        .trim()
        .notEmpty()
        .isString()
        .withMessage("Address must be string"),
    (0, express_validator_1.check)("destAdd", "Provide Destination Address")
        .trim()
        .notEmpty()
        .isString()
        .withMessage("Address must be string"),
    (0, express_validator_1.check)("bookingDate", "Provide Booking Dates")
        .trim()
        .notEmpty()
        .isDate()
        .withMessage("Invalid Date"),
    (0, express_validator_1.check)("address", "Address is required").trim().notEmpty(),
];
const validation = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        next();
    }
    else {
        return res.status(400).json({ error: errors.array()[0].msg });
    }
};
exports.validation = validation;
