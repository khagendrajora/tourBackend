import { Request, Response } from "express";
import User from "../models/User/userModel";
import bcryptjs from "bcryptjs";
import Driver from "../models/Business/Driver";
import Business from "../models/Business/business";
import jwt from "jsonwebtoken";
import BusinessManager from "../models/Business/businessManager";
import Sales from "../models/Business/Sales";

// const createAuthToken = (id: string) => {
//   return jwt.sign({ id }, process.env.JWTSECRET as string, { expiresIn: "1h" });
// };

// const setAuthCookie = (res: Response, authToken: string) => {
//   res.cookie("authTOken", authToken, {
//     httpOnly: true,
//     sameSite: "strict",
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 3600000,
//   });
// };

export const login = async (req: Request, res: Response) => {
  const { email, Pwd } = req.body;
  let userData;

  try {
    const user =
      (await User.findOne({ email })) ||
      (await Business.findOne({ primaryEmail: email })) ||
      (await Driver.findOne({ email })) ||
      (await BusinessManager.findOne({ email })) ||
      (await Sales.findOne({ email }));

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const isPassword = await bcryptjs.compare(Pwd, user.password);
    if (!isPassword) {
      return res.status(400).json({ error: "Credentials not matched" });
    }

    if ("isVerified" in user && user.isVerified === false) {
      return res.status(400).json({ error: "Email not Verified" });
    }

    if ("isActive" in user && user.isActive === false) {
      return res.status(400).json({ error: "Account not Activated" });
    }
    if (!process.env.JWTSECRET) {
      return res.status(500).json({ error: "JWT_SECRET is not defined" });
    }

    const authToken = jwt.sign({ id: user._id }, process.env.JWTSECRET, {
      expiresIn: "1h",
    });

    if (!authToken) return res.status(401).json({ error: "Failed" });
    // const authToken = createAuthToken(user._id.toString());
    // setAuthCookie(res, authToken);

    if (user instanceof User) {
      userData = {
        email: email,
        loginedId: user.userId,
        role: user.role,
        name: user.name,
      };
    } else if (user instanceof Driver) {
      userData = {
        loginedId: user.driverId,
        businessId: user.businessId,
        role: user.role,
        email: email,
        name: user.name,
      };
    } else if (user instanceof Business) {
      userData = {
        loginedId: user.businessId,
        role: user.role,
        email: email,
        name: user.businessName,
      };
    } else if (user instanceof BusinessManager) {
      userData = {
        businessId: user.businessId,
        role: user.role,
        email: email,
        name: user.name,
        loginedId: user.managerId,
      };
    } else if (user instanceof Sales) {
      userData = {
        businessId: user.businessId,
        role: user.role,
        email: email,
        name: user.name,
        loginedId: user.salesId,
      };
    }

    return res.status(200).json({
      message: "Login Successful",
      authToken,
      userData: userData,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
