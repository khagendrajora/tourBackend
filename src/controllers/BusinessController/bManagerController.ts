import { Request, Response } from "express";
import BusinessManager from "../../models/Business/businessManager";
import { sendEmail } from "../../utils/setEmail";
import { customAlphabet } from "nanoid";
import bcryptjs from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import Driver from "../../models/Business/Driver";
import User from "../../models/User/userModel";
import Business from "../../models/Business/business";

cloudinary.config({
  cloud_name: "dwepmpy6w",
  api_key: "934775798563485",
  api_secret: "0fc2bZa8Pv7Vy22Ji7AhCjD0ErA",
});

export const addBusinessManager = async (req: Request, res: Response) => {
  const customId = customAlphabet("1234567890", 4);
  let managerId = customId();
  managerId = "M" + managerId;
  const { businessId, name, email, password } = req.body;
  try {
    const driver = await Driver.findOne({ email });
    if (driver) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const client = await User.findOne({ email });
    if (client) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const businessData = await Business.findOne({ businessId: businessId });
    if (!businessData) {
      return res.status(400).json({ error: "Business Not Found" });
    }

    const emailCheck = await Business.findOne({
      primaryEmail: { $ne: businessData.primaryEmail },
      $or: [{ primaryEmail: email }],
    });

    if (emailCheck) {
      return res.status(400).json({ error: "Email already Registered" });
    }
    const salt = await bcryptjs.genSalt(5);
    let hashedPassword = await bcryptjs.hash(password, salt);
    if (!hashedPassword) {
      return res.status(400).json({ error: "Failed to save password " });
    }
    let image: string | undefined = undefined;
    if (req.files) {
      const files = req.files as { [fieldName: string]: Express.Multer.File[] };

      if (files["image"]) {
        const result = await cloudinary.uploader.upload(
          files["image"][0]?.path,
          {
            folder: "managerImage",
            use_filename: true,
            unique_filename: false,
          }
        );
        image = result.secure_url;
      }

      let newManager = new BusinessManager({
        businessId,
        name,
        email,
        password: hashedPassword,
        image,
      });
      newManager = await newManager.save();
      if (!newManager) {
        return res.status(400).json({ error: "Failed" });
      }
      sendEmail({
        from: "beta.toursewa@gmail.com",
        to: businessData.primaryEmail,
        subject: "New Manager Added",
        html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://asset.cloudinary.com/dwepmpy6w/7b4489e2ccf4981edf7a8ead0976f935' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Verify your Email address</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              A new Manager to the business ${businessData.businessName} with name ${name} is added. 
            </p>
          </div>
        </div>
      </div> `,
      });
    }
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBusinessManager = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await BusinessManager.find({ businessId: id });
    if (data.length === 0) {
      return res.status(404).json({ error: "Not Found" });
    }
    return res.send(data);
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateBusinessManager = async (req: Request, res: Response) => {
  const businessId = req.params.id;
  const { name, email, role } = req.body;
  try {
    let image: string | undefined = undefined;
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["image"]) {
        const result = await cloudinary.uploader.upload(
          files["image"][0]?.path,
          {
            folder: "managerImage",
            use_filename: true,
            unique_filename: false,
          }
        );
        image = result.secure_url;
      }
    }
    const data = await BusinessManager.findOneAndUpdate(
      { businessId },
      {
        name,
        email,
        role,
        image,
      },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({ error: "Failed to Updated" });
    }
    return res.status(200).json({ message: "Updated" });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
