import { check, validationResult } from "express-validator";

export const adminSignup = [
  check("adminName").trim().notEmpty().withMessage("Admin Name is required"),
  check("Email", "Email is required").trim().notEmpty().isEmail(),
  check("Pwd", "Password is required")
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Pwd length must be mininum 8"),
  check("cPwd", "CPassword not matched").trim().notEmpty(),
];

export const addBusinessData = [
  check("businessName", "Give Your Business Name").trim().notEmpty(),
  check("taxRegistration", "Invalid Tax Registration").trim().notEmpty(),
  check("address", "Provide Address").trim().notEmpty(),
  check("primaryEmail", "Email is required")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Invalid Email"),
  check("primaryPhone", "Phone Number is required").trim().notEmpty(),
  check("password", "password is required")
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("password length must be 8"),
];

export const addBusinessProfileData = [
  check("businessAddress[Address]", "Address is required").trim().notEmpty(),
  check("businessAddress[country]", "Country is required").trim().notEmpty(),
  check("businessAddress[city]", "City is required").trim().notEmpty(),
  check("businessAddress[state]", "State is required").trim().notEmpty(),
  check("businessRegistration[authority]", "Authority is required")
    .trim()
    .notEmpty(),
  check(
    "businessRegistration[registrationNumber]",
    "Registration Number is required"
  )
    .trim()
    .notEmpty(),
  check("businessRegistration[registrationOn]", "Registration Date is required")
    .trim()
    .notEmpty()
    .isDate()
    .withMessage("Invalid Date"),
  check("businessRegistration[expiresOn]", "Expiery Date is required")
    .trim()
    .notEmpty()
    .isDate()
    .withMessage("Invalid Date"),
  check("contactName", "Contact Name is required").trim().notEmpty(),
];

export const addCategoryData = [
  check("categoryName", "Category is required").trim().notEmpty(),
];

export const addSubCategoryData = [
  check("subCategoryName", "Sub Category is required").trim().notEmpty(),
];

export const addPropertyData = [
  check("PropName", "Property name is required").trim().notEmpty(),
  check("PropCategory", "Sub Category is required").trim().notEmpty(),
  check("Email", "Provide Email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Invalid Email"),
  check("Phone", "Phone is required").trim().notEmpty(),
  check("BusinessReg", "BusinessReg  is required").trim().notEmpty(),
  check("Tax", "Tax  is required").trim().notEmpty(),
  check("ContactName", "Contact name  is required").trim().notEmpty(),
  check("ContactPhone", "Contact Phone  is required").trim().notEmpty(),
  check("DateOfEstab", "Date of Estb. is required")
    .trim()
    .notEmpty()
    .isDate()
    .withMessage("Invalid Date"),
];

export const validation = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
};
