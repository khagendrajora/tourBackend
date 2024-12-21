import { Request, Response } from "express";
import AdminUser from "../models/adminUser";
import bcryptjs from "bcryptjs";
import Business from "../models/business";
import jwt from "jsonwebtoken";
import Token from "../models/token";
const { customAlphabet } = require("nanoid");
import { v4 as uuid } from "uuid";
import Driver from "../models/Drivers/Driver";
import { sendEmail } from "../utils/setEmail";
import User from "../models/User/userModel";

export const addAdminUser = async (req: Request, res: Response) => {
  const { adminName, adminEmail, adminPwd } = req.body;
  const customId = customAlphabet("1234567890", 4);
  const adminId = customId();
  try {
    const salt = await bcryptjs.genSalt(5);
    const hashedPwd = await bcryptjs.hash(adminPwd, salt);

    let user = new AdminUser({
      adminName,
      adminEmail,
      adminPwd: hashedPwd,
      adminId: adminId,
    });

    const email = await User.findOne({ userEmail: adminEmail });
    if (email) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const driverEmail = await Driver.findOne({ driverEmail: adminEmail });
    if (driverEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const businessEmail = await Business.findOne({ primaryEmail: adminEmail });
    if (businessEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    AdminUser.findOne({ adminEmail }).then(async (data) => {
      if (data) {
        return res.status(400).json({ error: "Email already Used" });
      } else {
        user = await user.save();
        if (!user) {
          res.status(400).json({ error: "failed to submit" });
        } else {
          return res.send(user);
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const adminlogin = async (req: Request, res: Response) => {
  const { adminEmail, adminPwd } = req.body;

  try {
    if (!adminEmail || !adminPwd) {
      return res.status(400).json({ error: "fill all Fields" });
    }
    const data = await AdminUser.findOne({ adminEmail: adminEmail });
    if (!data) {
      return res.status(404).json({ error: "Email not found" });
    }

    const isPassword = await bcryptjs.compare(adminPwd, data.adminPwd);
    if (!isPassword) {
      return res.status(400).json({ error: "password  not matched" });
    }

    const userID = data.id;
    const authToken = jwt.sign(userID, process.env.JWTSECRET as string);
    res.cookie("authToken", authToken, {
      // httpOnly: true,
      // sameSite: "strict",
      // maxAge: 3600000,
      // secure: false,
      expires: new Date(Date.now() + 99999),
    });

    return res.status(200).json({
      message: "Login succssfully",
      authToken: authToken,
      userId: data._id,
      adminEmail: adminEmail,
      adminName: data.adminName,
      adminRole: data.adminRole,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAdmin = async (req: Request, res: Response) => {
  try {
    await AdminUser.find().then((data) => {
      if (!data) {
        return res.status(400).json({ error: "Failed to get Users" });
      } else {
        return res.send(data);
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const businessApprove = async (req: Request, res: Response) => {
  const id = req.params.id;
  let status = "";
  // const authToken = req.cookies.authToken;
  // if (!authToken) {
  //   return res.status(404).json({ error: "Token not found or login first" });
  // }
  try {
    // const decodedToken = jwt.verify(
    //   authToken,
    //   process.env.JWTSECRET as string
    // ) as { id: string };
    // const userId = decodedToken.id;
    // const user = await AdminUser.findOne({ userId });
    // if (!user) {
    //   return res.status(404).json({ err: "failed to Get user ID" });
    // }
    // if (user?.Role == true) {
    const business = await Business.findOne({ bId: id });
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    business.isActive = !business.isActive;
    const updatedBusiness = await business.save();

    if (business.isActive) {
      status = "Activated";
    } else {
      status = "Deactivated";
    }

    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: business.primaryEmail,
      subject: "Business Account Status ",
      html: `<h2>Your business account with business Id ${id} has been made ${status}</h2>`,
    });

    return res.status(200).json({
      data: updatedBusiness,
      message: `Business is ${status}`,
    });
    // } else {
    //   return res.status(401).json({ error: "Unauthorized" });
    // }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// export const adminSignOut = async (req: Request, res: Response) => {
//   const authToken = req.cookies.authToken;

//   try {
//     if (!authToken) {
//       return res.status(400).json({ error: "token not found " });
//     } else {
//       res.clearCookie("authToken", {
//         // httpOnly: true,
//         // sameSite: "strict",
//       });
//       return res.status(200).json({ message: "Sign Out Successfully" });
//     }
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// };

export const forgetPass = async (req: Request, res: Response) => {
  let adminEmail = req.body.adminEmail;
  try {
    const data = await AdminUser.findOne({ adminEmail });
    if (!data) {
      return res.status(404).json({ error: "Email not found" });
    }

    let token = new Token({
      token: uuid(),
      userId: data._id,
    });
    token = await token.save();
    if (!token) {
      return res.status(400).json({ error: "Token not generated" });
    }
    const url = `${process.env.FRONTEND_URL}/resetpwd/${token.token}`;
    const api = `${process.env.Backend_URL}`;
    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: data.adminEmail,
      subject: "Password Reset Link",
      text: `Reset password USing link below\n\n
    http://${api}/resetpwd/${token.token}
    `,
      html: `<h1>Click to Reset Password</h1>
    <a href='${url}'>Click here Reset</a>`,
    });
    return res
      .status(200)
      .json({ message: "Password reset link sent to your email" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const resetPass = async (req: Request, res: Response) => {
  const token = req.params.token;
  const newPwd = req.body.adminPwd;
  try {
    const data = await Token.findOne({ token });
    if (!data) {
      return res.status(404).json({ error: "Token not found" });
    }
    const userId = await AdminUser.findOne({ _id: data.userId });
    if (!userId) {
      return res.status(404).json({ error: "Token and Email not matched" });
    }

    const isOldPwd = await bcryptjs.compare(newPwd, userId.adminPwd);

    if (isOldPwd) {
      return res.status(400).json({ error: "Password Previously Used" });
    } else {
      const salt = await bcryptjs.genSalt(5);
      let hashedPwd = await bcryptjs.hash(newPwd, salt);
      userId.adminPwd = hashedPwd;
      userId.save();

      await Token.deleteOne({ _id: data._id });

      return res.status(201).json({ message: "Successfully Reset" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const addBusinessByAdmin = async (req: Request, res: Response) => {
  const customId = customAlphabet("1234567890", 4);
  let bId = customId();
  bId = "B" + bId;
  const { registrationNumber } = req.body.businessRegistration;
  const { country, state } = req.body.businessAddress;
  const {
    businessName,
    businessCategory,
    primaryEmail,
    primaryPhone,
    businessPwd,
  } = req.body;

  try {
    if (businessPwd == "") {
      return res.status(400).json({ error: "Password is reqired" });
    }
    const tax = await Business.findOne({
      "businessRegistration.registrationNumber": registrationNumber,
    });
    if (tax) {
      return res
        .status(400)
        .json({ error: "Registration Number is already Used" });
    }

    const email = await Business.findOne({ primaryEmail });
    if (email) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const userEmail = await User.findOne({ userEmail: primaryEmail });
    if (userEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const driverEmail = await Driver.findOne({ driverEmail: primaryEmail });
    if (driverEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const adminEmail = await AdminUser.findOne({ adminEmail: primaryEmail });
    if (adminEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const phone = await Business.findOne({ primaryPhone });
    if (phone) {
      return res
        .status(400)
        .json({ error: "Phone Number already registered " });
    }

    const salt = await bcryptjs.genSalt(5);
    let hashedPassword = await bcryptjs.hash(businessPwd, salt);
    let business = new Business({
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
      bId: bId,
      businessPwd: hashedPassword,
    });
    business = await business.save();

    if (!business) {
      hashedPassword = "";
      return res.status(400).json({ error: "Failed to save the business" });
    }
    let token = new Token({
      token: uuid(),
      userId: business._id,
    });
    token = await token.save();
    if (!token) {
      return res.status(400).json({ error: "Token not generated" });
    }
    const url = `${process.env.FRONTEND_URL}/resetandverify/${token.token}`;
    const api = `${process.env.Backend_URL}`;

    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: business.primaryEmail,
      subject: "Account Verification Link",
      text: `Verify your Business Email to Login\n\n
      ${api}/resetandverify/${token.token}`,
      html: `<h1>Reset Password to Verify</h1> 
      <a href='${url}'>Click here To verify</a>`,
    });

    hashedPassword = "";

    return res
      .status(200)
      .json({ message: "Verifying link has been sent to Email " });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const verifyAndResetPwd = async (req: Request, res: Response) => {
  const token = req.params.token;
  const newPwd = req.body.businessPwd;
  try {
    const data = await Token.findOne({ token });
    if (!data) {
      return res.status(404).json({ error: "Token Expired" });
    }
    const businessId = await Business.findOne({ _id: data.userId });
    if (!businessId) {
      return res.status(404).json({ error: "Token and Email not matched" });
    }
    if (businessId.isVerified) {
      return res.status(400).json({ error: "Email Already verified" });
    }

    const isOldPwd = await bcryptjs.compare(newPwd, businessId.businessPwd);
    if (isOldPwd) {
      return res.status(400).json({ error: "Password Previously Used" });
    } else {
      const salt = await bcryptjs.genSalt(5);
      let hashedPwd = await bcryptjs.hash(newPwd, salt);
      businessId.businessPwd = hashedPwd;
      businessId.isVerified = true;

      await Token.deleteOne({ _id: data._id });

      businessId.save().then((business) => {
        if (!business) {
          return res.status(400).json({ error: "Failed to Verify" });
        } else {
          sendEmail({
            from: "beta.toursewa@gmail.com",
            to: "khagijora2074@gmail.com",
            subject: "New Business Registered",
            html: `<h2>A new business with business Id ${businessId.bId} has been registered</h2>
          <a href='${process.env.FRONTEND_URL}/businessapprove/${businessId.bId}'>Click to verify and activate the business account</a>
          `,
          });
        }
      });
      return res
        .status(200)
        .json({ message: "Email Verified and New Password is set" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deleteAdmin = await AdminUser.findByIdAndDelete(id);
    if (!deleteAdmin) {
      return res.status(404).json({ error: "Failed to delete" });
    }

    return res.status(200).json({ message: "Successfully Deleted" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
