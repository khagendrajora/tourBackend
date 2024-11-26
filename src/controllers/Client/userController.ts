import ClientUser from "../../models/Client/userModel";
import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import Token from "../../models/token";
import { uuid } from "uuidv4";
import { sendEmail } from "../../utils/setEmail";
// import jwt from "jsonwebtoken";
const { customAlphabet } = require("nanoid");
import ReservationDate from "../../models/Reservations/ReservedDated";
import Driver from "../../models/Drivers/Driver";
import Business from "../../models/business";
import AdminUser from "../../models/adminUser";

export const addNewClient = async (req: Request, res: Response) => {
  const { userName, userEmail, userPwd } = req.body;
  const customId = customAlphabet("1234567890", 4);
  let userId = customId();
  userId = "U" + userId;
  try {
    let userImage: string | undefined = undefined;
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files["userImage"]) {
        userImage = files["userImage"][0]?.path;
      }
    }
    if (userPwd == "") {
      return res.status(400).json({ error: "Password is reqired" });
    }

    const email = await ClientUser.findOne({ userEmail });
    if (email) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const driverEmail = await Driver.findOne({ driverEmail: userEmail });
    if (driverEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const businessEmail = await Business.findOne({ primaryEmail: userEmail });
    if (businessEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const adminEmail = await AdminUser.findOne({ adminEmail: userEmail });
    if (adminEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const salt = await bcryptjs.genSalt(5);
    let hashedPassword = await bcryptjs.hash(userPwd, salt);
    let clientUser = new ClientUser({
      userName,
      userEmail,
      userPwd: hashedPassword,
      userImage,
      userId: userId,
    });
    clientUser = await clientUser.save();

    if (!clientUser) {
      hashedPassword = "";
      return res.status(400).json({ error: "Failed to save the User" });
    }
    let token = new Token({
      token: uuid(),
      userId: clientUser._id,
    });
    token = await token.save();
    if (!token) {
      return res.status(400).json({ error: "Token not generated" });
    }
    const url = `${process.env.FRONTEND_URL}/verifyemail/${token.token}`;
    const api = `${process.env.Backend_URL}`;

    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: clientUser.userEmail,
      subject: "Account Verification Link",
      text: `Verify your Business Email to Login\n\n
    ${api}/verifyuseremail/${token.token}`,
      html: `<h1>Click to Verify Email</h1> 
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

export const verifyUserEmail = async (req: Request, res: Response) => {
  const token = req.params.token;
  try {
    const data = await Token.findOne({ token });
    if (!data) {
      return res.status(404).json({ error: "Token Expired" });
    }
    const userId = await ClientUser.findOne({ _id: data.userId });
    if (!userId) {
      return res.status(404).json({ error: "Token and Email not matched" });
    }
    if (userId.isVerified) {
      return res.status(400).json({ error: "Email Already verified" });
    }
    userId.isVerified = true;
    userId.save().then((user) => {
      if (!user) {
        return res.status(400).json({ error: "Failed to Verify" });
      } else {
        return res.status(200).json({ message: "Email Verified" });
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// export const clientLogin = async (req: Request, res: Response) => {
//   const { userEmail, userPwd } = req.body;
//   try {
//     const clientEmail = await ClientUser.findOne({
//       userEmail: userEmail,
//     });
//     if (!clientEmail) {
//       return res.status(404).json({
//         error: "Email not found",
//       });
//     }
//     const isPassword = await bcryptjs.compare(userPwd, clientEmail.userPwd);
//     if (!isPassword) {
//       return res.status(400).json({ error: "Incorrect Password" });
//     }
//     const data = { id: clientEmail._id };
//     const authToken = jwt.sign(data, process.env.JWTSECRET as string);
//     res.cookie("authToken", authToken, {
//       httpOnly: true,
//       sameSite: "strict",
//       maxAge: 3600000,
//     });
//     return res.status(200).json({
//       message: "Login succssfully",
//       authToken: authToken,
//       clientId: clientEmail._id,
//       userEmail: clientEmail.userEmail,
//       userRole: clientEmail.userRole,
//       userName: clientEmail.userName,
//     });
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// };

export const getClients = async (req: Request, res: Response) => {
  try {
    await ClientUser.find().then((data) => {
      if (data.length > 0) {
        return res.send(data);
      } else {
        return res.status(400).json({ error: "Not Found" });
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const client = await ClientUser.findById(id);
    if (!client) {
      return res.status(200).json({ error: "Failed to get the Profile" });
    } else {
      return res.send(client);
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const changePwd = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { newPwd, userPwd } = req.body;
  try {
    const userData = await ClientUser.findById(id);
    if (!userData) {
      return res.status(400).json({ error: "Failed" });
    }
    const isPwd = await bcryptjs.compare(userPwd, userData.userPwd);
    if (!isPwd) {
      return res.status(400).json({ error: "Incorrect Old Password" });
    }
    const salt = await bcryptjs.genSalt(5);
    let hashedPwd = await bcryptjs.hash(newPwd, salt);
    const newData = await ClientUser.findByIdAndUpdate(
      id,
      {
        userPwd: hashedPwd,
      },
      { new: true }
    );
    if (!newData) {
      return res.status(400).json({ error: "Failed to Change" });
    } else {
      return res.status(200).json({ message: "Password Changed" });
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const updateProfileById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { userName, userEmail } = req.body;
  try {
    let userImage: string | null = req.body.userImage || null;
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files["userImage"]) {
        userImage = files["userImage"][0]?.path;
      }
    } else if (req.body.userImage) {
      userImage = req.body.userImage;
    } else if (req.body.userImage === "") {
      userImage = null;
    }

    const data = await ClientUser.findByIdAndUpdate(
      id,
      {
        userName,
        userEmail,
        userImage,
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({ error: "Failed To Update" });
    } else {
      return res.status(200).json({ message: "Sucessfully Updated" });
    }
  } catch (error: any) {
    return res.status(200).json({ error: error.message });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deleteClient = await ClientUser.findByIdAndDelete(id);
    if (!deleteClient) {
      return res.status(404).json({ error: "Failed to delete" });
    }
    return res.status(200).json({ message: "Successfully Deleted" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const forgetPwd = async (req: Request, res: Response) => {
  let userEmail = req.body.userEmail;
  try {
    const data = await ClientUser.findOne({ userEmail });
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
    const url = `${process.env.FRONTEND_URL}/resetuserpwd/${token.token}`;
    const api = `${process.env.Backend_URL}`;
    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: data.userEmail,
      subject: "Password Reset Link",
      text: `Reset password Using link below\n\n
      ${api}/resetuserpwd/${token.token}
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

export const resetPwd = async (req: Request, res: Response) => {
  const token = req.params.token;
  const newPwd = req.body.userPwd;
  try {
    const data = await Token.findOne({ token });
    if (!data) {
      return res.status(404).json({ error: "Token not found" });
    }
    const userId = await ClientUser.findOne({ _id: data.userId });
    if (!userId) {
      return res.status(404).json({ error: "Token and Email not matched" });
    } else {
      const salt = await bcryptjs.genSalt(5);
      let hashedPwd = await bcryptjs.hash(newPwd, salt);
      userId.userPwd = hashedPwd;
      userId.save();

      await Token.deleteOne({ _id: data._id });

      return res.status(201).json({ message: "Reset Successful" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMyReservations = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const myReservation = await ReservationDate.find({ bookedBy: id });
    if (!myReservation) {
      return res.status(404).json({ error: "NO Reservation" });
    } else {
      return res.send(myReservation);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
