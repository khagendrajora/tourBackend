"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = exports.reservationData = exports.addPropertyData = exports.addCategoryData = exports.addBusinessData = exports.adminSignup = void 0;
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
    (0, express_validator_1.check)("businessRegistration[registrationNumber]", "Invalid Tax Registration")
        .trim()
        .notEmpty(),
    (0, express_validator_1.check)("businessAddress[country]", "Provide Country Name").trim().notEmpty(),
    (0, express_validator_1.check)("businessAddress[state]", "Provide State Name").trim().notEmpty(),
    (0, express_validator_1.check)("primaryEmail", "Email is required")
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage("Invalid Email"),
    (0, express_validator_1.check)("primaryPhone", "Phone Number is required").trim().notEmpty(),
    (0, express_validator_1.check)("businessPwd", "password is required")
        .trim()
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("password length must be 8"),
];
exports.addCategoryData = [
    (0, express_validator_1.check)("categoryName", "Category is required").trim().notEmpty(),
];
exports.addPropertyData = [
    (0, express_validator_1.check)("propName", "Property name is required").trim().notEmpty(),
    (0, express_validator_1.check)("propCategory", "Sub Category is required").trim().notEmpty(),
    (0, express_validator_1.check)("email", "Provide Email")
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage("Invalid Email"),
    (0, express_validator_1.check)("phone", "Phone is required").trim().notEmpty(),
    (0, express_validator_1.check)("businessReg", "BusinessReg  is required").trim().notEmpty(),
    (0, express_validator_1.check)("tax", "Tax  is required").trim().notEmpty(),
    (0, express_validator_1.check)("contactName", "Contact name  is required").trim().notEmpty(),
    (0, express_validator_1.check)("contactPhone", "Contact Phone  is required").trim().notEmpty(),
    (0, express_validator_1.check)("dateOfEstab", "Date of Estb. is required")
        .trim()
        .notEmpty()
        .isDate()
        .withMessage("Invalid Date"),
];
exports.reservationData = [
    (0, express_validator_1.check)("bookingName", "Provide Passenger Name").trim().notEmpty(),
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
    (0, express_validator_1.check)("sourceAddress", "Provide Source Address")
        .trim()
        .notEmpty()
        .isString()
        .withMessage("Address must be string"),
    (0, express_validator_1.check)("destinationAddress", "Provide Destination Address")
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
