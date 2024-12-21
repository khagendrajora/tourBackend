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
  check("businessRegistration[registrationNumber]", "Invalid Tax Registration")
    .trim()
    .notEmpty(),
  check("businessAddress[country]", "Provide Country Name").trim().notEmpty(),
  check("businessAddress[state]", "Provide State Name").trim().notEmpty(),
  check("primaryEmail", "Email is required")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Invalid Email"),
  check("primaryPhone", "Phone Number is required").trim().notEmpty(),
  check("businessPwd", "password is required")
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("password length must be 8"),
];

export const addCategoryData = [
  check("categoryName", "Category is required").trim().notEmpty(),
];

// export const addSubCategoryData = [
//   check("subCategoryName", "Sub Category is required").trim().notEmpty(),
// ];

export const addPropertyData = [
  check("propName", "Property name is required").trim().notEmpty(),
  check("propCategory", "Sub Category is required").trim().notEmpty(),
  check("email", "Provide Email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Invalid Email"),
  check("phone", "Phone is required").trim().notEmpty(),
  check("businessReg", "BusinessReg  is required").trim().notEmpty(),
  check("tax", "Tax  is required").trim().notEmpty(),
  check("contactName", "Contact name  is required").trim().notEmpty(),
  check("contactPhone", "Contact Phone  is required").trim().notEmpty(),
  check("dateOfEstab", "Date of Estb. is required")
    .trim()
    .notEmpty()
    .isDate()
    .withMessage("Invalid Date"),
];

export const reservationData = [
  check("bookingName", "Provide Passenger Name").trim().notEmpty(),

  check("age", "Provide Age")
    .trim()
    .notEmpty()
    .isInt()
    .withMessage("Age must be number"),
  check("email", "Provide Email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Invalid Email"),
  check("phone", "Phone is required").trim().notEmpty(),
  check("sourceAddress", "Provide Source Address")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Address must be string"),
  check("destinationAddress", "Provide Destination Address")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Address must be string"),
  check("bookingDate", "Provide Booking Dates")
    .trim()
    .notEmpty()
    .isDate()
    .withMessage("Invalid Date"),
  check("address", "Address is required").trim().notEmpty(),
];

export const validation = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
};
