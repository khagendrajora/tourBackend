import { Request, Response } from "express";
import User from "../models/User/userModel";
import bcryptjs from "bcryptjs";
import Driver from "../models/Drivers/Driver";
import Business from "../models/business";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  const { email, Pwd } = req.body;
  try {
    const clientEmail = await User.findOne({
      userEmail: email,
    });
    if (clientEmail) {
      const isPassword = await bcryptjs.compare(Pwd, clientEmail.userPwd);
      if (!isPassword) {
        return res.status(400).json({ error: "Credentials not matched" });
      }
      const isVerified = clientEmail.isVerified;

      if (!isVerified) {
        return res.status(400).json({ error: "Email not Verified" });
      }

      const data = { id: clientEmail._id };
      const authToken = jwt.sign(data, process.env.JWTSECRET as string);
      res.cookie("authToken", authToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 3600000,
      });
      return res.status(200).json({
        message: "Login succssfully",
        authToken: authToken,
        userId: clientEmail.userId,
        clientId: clientEmail._id,
        userEmail: clientEmail.userEmail,
        userRole: clientEmail.userRole,
        userName: clientEmail.userName,
      });
    } else {
      const businessEmail = await Business.findOne({
        primaryEmail: email,
      });
      if (businessEmail) {
        const isPassword = await bcryptjs.compare(
          Pwd,
          businessEmail.businessPwd
        );
        if (!isPassword) {
          return res.status(400).json({ error: "Credentials not matched" });
        }

        const isVerified = businessEmail.isVerified;

        if (!isVerified) {
          return res.status(400).json({ error: "Email not Verified" });
        }

        const isActive = businessEmail.isActive;

        if (!isActive) {
          return res.status(400).json({ error: "Account not Activated" });
        }
        const data = { id: businessEmail._id };
        const authToken = jwt.sign(data, process.env.JWTSECRET as string);
        res.cookie("authToken", authToken, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 3600000,
        });
        return res.status(200).json({
          message: "Login succssfully",
          authToken: authToken,
          businesId: businessEmail._id,
          primaryEmail: businessEmail.primaryEmail,
          businessRole: businessEmail.businessRole,
          businessName: businessEmail.businessName,
          bId: businessEmail.bId,
        });
      } else {
        const driverEmail = await Driver.findOne({
          driverEmail: email,
        });
        if (driverEmail) {
          const isPassword = await bcryptjs.compare(Pwd, driverEmail.driverPwd);
          if (!isPassword) {
            return res.status(400).json({ error: "Credentials not matched" });
          }
          const isVerified = driverEmail.isVerified;
          if (!isVerified) {
            return res.status(400).json({ error: "Email not Verified" });
          }
          const data = { id: email._id };
          const authToken = jwt.sign(data, process.env.JWTSECRET as string);
          res.cookie("authToken", authToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 3600000,
          });
          return res.status(200).json({
            message: "Login succssfully",
            authToken: authToken,
            driver_id: driverEmail._id,
            driverId: driverEmail.driverId,
            driverEmail: driverEmail.driverEmail,
            driverName: driverEmail.driverName,
            vehicleId: driverEmail.vehicleId,
          });
        } else {
          return res.status(400).json({ error: "Data not found" });
        }
      }
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
