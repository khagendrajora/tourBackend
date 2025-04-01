import { Request, Response } from "express";
import User from "../models/User/userModel";
import bcryptjs from "bcryptjs";
import Driver from "../models/Business/Driver";
import Business from "../models/Business/business";
import jwt from "jsonwebtoken";
import BusinessManager from "../models/Business/businessManager";
import Sales from "../models/Business/Sales";

const createAuthToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWTSECRET as string, { expiresIn: "1h" });
};

const setAuthCookie = (res: Response, authToken: string) => {
  res.cookie("authTOken", authToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600000, // 1 hour
  });
};

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

    const authToken = createAuthToken(user._id.toString());
    setAuthCookie(res, authToken);

    const { password, ...UserData } = user.toObject();

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
        vehicleId: user.vehicleId,
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
      userData: UserData,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
  // try {

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
};
