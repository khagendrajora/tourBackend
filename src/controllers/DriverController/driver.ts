import { Request, Response } from "express";
import Driver from "../../models/Drivers/Driver";
import Token from "../../models/token";
import { v4 as uuid } from "uuid";
import { sendEmail } from "../../utils/setEmail";
const { customAlphabet } = require("nanoid");
import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken";
import Business from "../../models/business";
import AdminUser from "../../models/adminUser";
import ClientUser from "../../models/User/userModel";

export const addDriver = async (req: Request, res: Response) => {
  const customId = customAlphabet("1234567890", 4);
  let driverId = customId();
  driverId = "D" + driverId;
  const {
    driverName,
    driverAge,
    driverPhone,
    driverEmail,
    vehicleId,
    businessId,
    driverPwd,
  } = req.body;
  try {
    let driverImage: string | undefined = undefined;
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["driverImage"]) {
        driverImage = files["driverImage"][0]?.path;
      }
    }
    const driverNumber = await Driver.findOne({ driverPhone });
    if (driverNumber) {
      return res.status(400).json({ error: "Phone Number is already used " });
    }

    const driver = await Driver.findOne({ driverEmail });
    if (driver) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const email = await ClientUser.findOne({ userEmail: driverEmail });
    if (email) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const businessEmail = await Business.findOne({ primaryEmail: driverEmail });
    if (businessEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const adminEmail = await AdminUser.findOne({ adminEmail: driverEmail });
    if (adminEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const salt = await bcryptjs.genSalt(5);
    let hashedPassword = await bcryptjs.hash(driverPwd, salt);

    let newDriver = new Driver({
      driverId: driverId,
      vehicleId: vehicleId,
      businessId: businessId,
      driverEmail: driverEmail,
      driverName: driverName,
      driverAge: driverAge,
      driverPhone: driverPhone,
      driverPwd: hashedPassword,
      driverImage,
    });
    newDriver = await newDriver.save();
    if (!newDriver) {
      return res.status(400).json({ error: "Failed" });
    }
    let token = new Token({
      token: uuid(),
      userId: newDriver._id,
    });
    token = await token.save();

    if (!token) {
      return res.status(400).json({ error: "Token not generated" });
    }
    const url = `${process.env.FRONTEND_URL}/verifydriveremail/${token.token}`;
    const api = `${process.env.Backend_URL}`;
    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: driverEmail,
      subject: "Account Verification Link",
      text: `Verify your Driver Email to Login\n\n
${api}/verifydriveremail/${token.token}`,
      html: `<h1>Click to Verify Email</h1> 
    <a href='${url}'>Click here To verify</a>`,
    });
    return res.status(200).json({ message: "Verification link send" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const verifyDriverEmail = async (req: Request, res: Response) => {
  const token = req.params.token;
  try {
    const data = await Token.findOne({ token });
    if (!data) {
      return res.status(404).json({ error: "Token Expired" });
    }
    const driverId = await Driver.findOne({ _id: data.userId });
    if (!driverId) {
      return res.status(404).json({ error: "Token and Email not matched" });
    }
    if (driverId.isVerified) {
      return res.status(400).json({ error: "Email Already verified" });
    }
    driverId.isVerified = true;
    driverId.save().then((driver) => {
      if (!driver) {
        return res.status(400).json({ error: "Failed to Verify" });
      } else {
        sendEmail({
          from: "beta.toursewa@gmail.com",
          to: driverId.driverEmail,
          subject: "Email Verified",
          html: `<h2>Your Email with business ID ${driverId.businessId} for vehicle ${driverId.vehicleId} has been verified</h2>`,
        });
        return res.status(200).json({ message: "Email Verified" });
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// export const driverLogin = async (req: Request, res: Response) => {
//   const { driverEmail, driverPwd } = req.body;
//   try {
//     const email = await Driver.findOne({
//       driverEmail: driverEmail,
//     });
//     if (!email) {
//       return res.status(404).json({
//         error: "Email not found",
//       });
//     }
//     const isPassword = await bcryptjs.compare(driverPwd, email.driverPwd);
//     if (!isPassword) {
//       return res.status(400).json({ error: "Incorrect Password" });
//     }

//     const isVerified = email.isVerified;

//     if (!isVerified) {
//       return res.status(400).json({ error: "Email not Verified" });
//     }

//     const data = { id: email._id };
//     const authToken = jwt.sign(data, process.env.JWTSECRET as string);
//     res.cookie("authToken", authToken, {
//       httpOnly: true,
//       sameSite: "strict",
//       maxAge: 3600000,
//     });
//     return res.status(200).json({
//       message: "Login succssfully",
//       authToken: authToken,
//       driver_id: email._id,
//       driverId: email.driverId,
//       driverEmail: email.driverEmail,
//       driverName: email.driverName,
//     });
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// };

export const updateDriverStatus = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { status, driverEmail } = req.body;
  try {
    const data = await Driver.findByIdAndUpdate(
      id,
      {
        status: status,
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({ error: "Update Failed" });
    }
    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: driverEmail,
      subject: "Status Changedd",
      html: `<h2>Your Status has been changed to ${status}</h2>`,
    });
    return res.status(200).json({ message: status });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getDrivers = async (req: Request, res: Response) => {
  try {
    await Driver.find().then((data) => {
      if (data.length > 0) {
        return res.send(data);
      } else {
        return res.status(200).json({ message: "Not Found" });
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getDriverByBId = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await Driver.find({ businessId: id });
    if (data.length === 0) {
      return res.status(400).json({ error: "No driver Found" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getDriverByVehId = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await Driver.find({ vehicleId: id });
    if (data.length === 0) {
      return res.status(400).json({ error: "No  Data" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getDriverById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await Driver.findById(id);
    if (!data) {
      return res.status(400).json({ error: "Failed to Get" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteDriver = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deleteDriver = await Driver.findByIdAndDelete(id);
    if (!deleteDriver) {
      return res.status(404).json({ error: "Failed to delete" });
    }

    return res.status(200).json({ message: "Successfully Deleted" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateDriver = async (req: Request, res: Response) => {
  const id = req.params.id;
  const {
    driverName,
    driverAge,
    driverPhone,
    driverEmail,
    vehicleId,
    businessId,
  } = req.body;
  try {
    let driverImage: string | undefined = undefined;

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["driverImage"]) {
        driverImage = files["driverImage"][0]?.path;
      }
    }
    const data = await Driver.findByIdAndUpdate(
      id,
      {
        driverName,
        driverAge,
        driverPhone,
        driverEmail,
        vehicleId,
        businessId,
        driverImage,
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({
        error: "Failed to Update",
      });
    } else {
      return res.send({
        message: "Updated",
        data: data,
      });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
