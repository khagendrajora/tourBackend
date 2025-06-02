import { Request, Response } from "express";
import Driver from "../../models/Business/Driver";
import Token from "../../models/token";
import { v4 as uuid } from "uuid";
import { sendEmail } from "../../utils/setEmail";
import { customAlphabet } from "nanoid";
import bcryptjs from "bcryptjs";
import Business from "../../models/Business/business";
import AdminUser from "../../models/adminUser";
import User from "../../models/User/userModel";
import DriverLogs from "../../models/LogModel/DriverLogs";
import { v2 as cloudinary } from "cloudinary";
import VehicleReservation from "../../models/Reservations/VehicleReservation/vehReserv";

export const addDriver = async (req: Request, res: Response) => {
  const customId = customAlphabet("1234567890", 4);
  let driverId = customId();
  driverId = "D" + driverId;
  const { name, phone, email, age, businessId, addedBy, password, DOB } =
    req.body;
  try {
    let image: string | undefined = undefined;
    const driverEmail =
      (await Driver.findOne({ email })) ||
      (await User.findOne({ email })) ||
      (await AdminUser.findOne({ adminEmail: email }));

    if (driverEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["image"]) {
        const result = await cloudinary.uploader.upload(
          files["image"][0]?.path,
          {
            folder: "driverImage",
            use_filename: true,
            unique_filename: false,
          }
        );
        image = result.secure_url;
      }
    }

    const driverNumber = await Driver.findOne({ phone });
    if (driverNumber) {
      return res
        .status(400)
        .json({ error: "Phone Number already Registered " });
    }

    const businessData = await Business.findOne({ businessId });
    if (!businessData) {
      return res.status(400).json({ error: "Business Not Found" });
    }

    const emailCheck = await Business.findOne({
      primaryEmail: email,
      _id: { $ne: businessData._id },
    });

    if (emailCheck) {
      return res.status(400).json({ error: "Email already Registered" });
    }

    const salt = await bcryptjs.genSalt(5);
    let hashedPassword = await bcryptjs.hash(password, salt);

    let newDriver = new Driver({
      driverId: driverId,
      businessId,
      businessName: businessData.businessName,
      email,
      name,
      age,
      DOB,
      phone,
      password: hashedPassword,
      image,
      addedBy,
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
      to: email,
      subject: "Account Verification Link",
      text: `Verify your Driver Email to Login\n\n
${api}/verifydriveremail/${token.token}`,

      html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://tourbackend-rdtk.onrender.com/public/uploads/logo.png' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Verify your Email address</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              To continue on Toursewa with your account, please verify that
              this is your email address.
            </p>
            <a href='${url}' style="display: inline-block; background-color: #e6310b; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Click to verify</a>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">
              This link will expire in 24 hours
            </p>
          </div>
        </div>
      </div> `,
    });
    return res
      .status(200)
      .json({ message: "Verifying link is sent to Your Email" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const verifyDriverEmail = async (req: Request, res: Response) => {
  const token = req.params.token;
  // const newPwd = req.body.password;
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

    // const isOldPwd = await bcryptjs.compare(newPwd, driverId.password);
    // if (isOldPwd) {
    //   return res.status(400).json({ error: "Password Previously Used" });
    // } else {
    // const salt = await bcryptjs.genSalt(5);
    // let hashedPwd = await bcryptjs.hash(newPwd, salt);
    // driverId.password = hashedPwd;
    driverId.isVerified = true;
    const businessEmail = await Business.findOne({
      businessId: driverId.businessId,
    });
    await Token.deleteOne({ _id: data._id });
    driverId.save().then((driver) => {
      if (!driver) {
        return res.status(400).json({ error: "Failed to Verify" });
      } else {
        sendEmail({
          from: "beta.toursewa@gmail.com",
          to: driverId.email,
          subject: "Email Verified",
          html: `<h2>Your Email with business ${driverId.businessName}  has been verified</h2>`,
        });
        sendEmail({
          from: "beta.toursewa@gmail.com",
          to: businessEmail?.primaryEmail,
          subject: "New Driver Registered",
          html: `<h2>New Driver with driver ID ${driverId.driverId} for vehicle} is Registered</h2>`,
        });
      }
    });
    return res.status(200).json({ message: "Email Verified" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateDriverStatus = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { status, updatedBy } = req.body;
  try {
    const driverData = await Driver.findOne({ driverId: id });
    if (!driverData) {
      return res.status(400).json({ errror: "Not Found" });
    }
    const data = await Driver.findOneAndUpdate(
      { driverId: id },
      {
        status: status,
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({ error: "Update Failed" });
    }

    let driverLog = new DriverLogs({
      updatedBy: updatedBy,
      productId: id,
      action: `Status change to ${status}`,
      time: new Date(),
    });
    driverLog = await driverLog.save();

    if (!driverLog) {
      return res.status(400).json({ error: "Failed to update" });
    }
    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: driverData.email,
      subject: "Status Changed",
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

export const getDriverById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await Driver.findOne({ driverId: id });
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
  const { updatedBy, action } = req.query;

  try {
    const deleteDriver = await Driver.findByIdAndDelete(id);
    if (!deleteDriver) {
      return res.status(404).json({ error: "Failed to delete" });
    }
    let driverLog = new DriverLogs({
      updatedBy: updatedBy,
      productId: id,
      action: action,
      time: new Date(),
    });
    driverLog = await driverLog.save();
    return res.status(200).json({ message: "Successfully Deleted" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateDriver = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, age, phone, email, updatedBy } = req.body;
  try {
    let image: string | undefined = undefined;

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["image"]) {
        const result = await cloudinary.uploader.upload(
          files["image"][0]?.path,
          {
            folder: "driverImage",
            use_filename: true,
            unique_filename: false,
          }
        );
        image = result.secure_url;
      }
    }

    const data = await Driver.findByIdAndUpdate(
      id,
      {
        name,
        age,
        phone,
        email,
        image,
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({
        error: "Failed to Update",
      });
    } else {
      let driverLog = new DriverLogs({
        updatedBy: updatedBy,
        productId: id,
        action: "updated",
        time: new Date(),
      });
      driverLog = await driverLog.save();

      if (!driverLog) {
        return res.status(400).json({ error: "Failed to update" });
      }

      return res.send({
        message: "Updated",
        data: data,
      });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateDriverDates = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { operationDates, updatedBy, vehicleId } = req.body;
  try {
    const driverData = await Driver.findByIdAndUpdate(
      { driverId: id },
      {
        operationDates,
        vehicleId,
      },
      { new: true }
    );
    if (!driverData) {
      return res.status(400).json({ error: "Failed to Update" });
    } else {
      let driverLog = new DriverLogs({
        updatedBy: updatedBy,
        productId: id,
        action: "updated",
        time: new Date(),
      });
      driverLog = await driverLog.save();

      if (!driverLog) {
        return res.status(400).json({ error: "Failed to update" });
      }
      return res.send({
        message: "Dates Updated",
      });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const resetPwd = async (req: Request, res: Response) => {
  const token = req.params.token;
  const newPwd = req.body.password;
  try {
    const data = await Token.findOne({ token });
    if (!data) {
      return res.status(404).json({ error: "Token not found" });
    }
    const driverId = await Driver.findOne({ _id: data.userId });
    if (!driverId) {
      return res.status(404).json({ error: "Token and Email not matched" });
    }
    const isOldPwd = await bcryptjs.compare(newPwd, driverId.password);

    if (isOldPwd) {
      return res.status(400).json({ error: "Password Previously Used" });
    } else {
      const salt = await bcryptjs.genSalt(5);
      let hashedPwd = await bcryptjs.hash(newPwd, salt);
      driverId.password = hashedPwd;
      driverId.save();

      await Token.deleteOne({ _id: data._id });

      return res.status(201).json({ message: "Reset Successful" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getReservations = async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!Array.isArray(id)) {
    return res.status(400).json({ error: "Booking Not Found" });
  }

  try {
    const bookings = await VehicleReservation.find({
      _id: { $in: id },
    });
    if (!bookings) {
      return res.status(400).json({ error: "Not Found" });
    }
    return res.send(bookings);
  } catch (error: any) {
    res.status(500).json({ error: error });
  }
};
