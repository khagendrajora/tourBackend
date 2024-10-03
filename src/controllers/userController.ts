import { Request, Response } from "express";
import AdminUser from "../models/adminUser";
import bcryptjs from "bcryptjs";
import Business from "../models/business";
import jwt from "jsonwebtoken";
import Token from "../models/token";
import { v4 as uuid } from "uuid";
import { sendEmail } from "../utils/setEmail";

export const addAdminUser = async (req: Request, res: Response) => {
  const { adminName, Email, Pwd, cPwd } = req.body;
  try {
    // if (Pwd !== cPwd) {
    //   return res
    //     .status(400)
    //     .json({ error: "password and confirm password dosent matched" });
    // }
    const salt = await bcryptjs.genSalt(5);
    const hashedPwd = await bcryptjs.hash(Pwd, salt);

    let user = new AdminUser({
      adminName,
      Email,
      Pwd: hashedPwd,
      cPwd: hashedPwd,
    });
    AdminUser.findOne({ Email }).then(async (data) => {
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
  const { Email, Pwd } = req.body;

  try {
    if (!Email || !Pwd) {
      return res.status(400).json({ error: "fill all Fields" });
    }
    const data = await AdminUser.findOne({ Email: Email });
    if (!data) {
      return res.status(404).json({ error: "Email not found" });
    }

    const isPassword = await bcryptjs.compare(Pwd, data.Pwd);
    if (!isPassword) {
      return res.status(400).json({ error: "password  not matched" });
    }

    const userID = data.id;
    const authToken = jwt.sign(userID, process.env.JWTSECRET as string);
    res.cookie("authToken", authToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600000,
    });

    return res.status(200).json({
      message: "Login succssfully",
      authToken: authToken,
      adminEmail: Email,
      adminName: data.adminName,
      role: data.Role,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const businessApprove = async (req: Request, res: Response) => {
  const id = req.params.id;
  const authToken = req.cookies.authToken;
  if (!authToken) {
    return res.status(404).json({ error: "Token not found or login first" });
  }
  try {
    const decodedToken = jwt.verify(
      authToken,
      process.env.JWTSECRET as string
    ) as { id: string };
    const userId = decodedToken.id;
    const user = await AdminUser.findOne({ userId });
    if (!user) {
      return res.status(404).json({ err: "failed to Get user ID" });
    }
    if (user?.Role == true) {
      const business = await Business.findById(id);
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }
      business.isActive = !business.isActive;
      const updatedBusiness = await business.save();

      return res.status(200).json({
        data: updatedBusiness,
      });
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const adminSignOut = async (req: Request, res: Response) => {
  const authToken = req.cookies.authToken;

  try {
    if (!authToken) {
      return res.status(400).json({ error: "token not found " });
    } else {
      res.clearCookie("authToken", {
        httpOnly: true,
        sameSite: "strict",
      });
      return res.status(200).json({ message: "Sign Out Successfully" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const forgetPass = async (req: Request, res: Response) => {
  let Email = req.body.Email;
  try {
    const data = await AdminUser.findOne({ Email });
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
      to: data.Email,
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
  const newPwd = req.body.Pwd;
  try {
    const data = await Token.findOne({ token });
    if (!data) {
      return res.status(404).json({ error: "Token not found" });
    }
    const userId = await AdminUser.findOne({ _id: data.userId });
    if (!userId) {
      return res.status(404).json({ error: "Token and Email not matched" });
    } else {
      const salt = await bcryptjs.genSalt(5);
      let hashedPwd = await bcryptjs.hash(newPwd, salt);
      userId.Pwd = hashedPwd;
      userId.save();

      await Token.deleteOne({ _id: data._id });

      return res.status(201).json({ message: "Successfully Reset" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
