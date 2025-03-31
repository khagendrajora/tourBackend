import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import Business from "../../models/Business/business";
import Driver from "../../models/Business/Driver";
import AdminUser from "../../models/adminUser";
import Token from "../../models/token";
import { v4 as uuid } from "uuid";
import { sendEmail } from "../../utils/setEmail";
import User from "../../models/User/userModel";
const { customAlphabet } = require("nanoid");
import Feature from "../../models/Featured/Feature";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dwepmpy6w",
  api_key: "934775798563485",
  api_secret: "0fc2bZa8Pv7Vy22Ji7AhCjD0ErA",
});

export const addBusiness = async (req: Request, res: Response) => {
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
      addedBy: bId,
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
    const url = `${process.env.FRONTEND_URL}/verifybusinessemail/${token.token}`;
    const api = `${process.env.Backend_URL}`;

    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: business.primaryEmail,
      subject: "Email Verification Link",
      text: `Verify your Business Email to Login\n\n
${api}/verifybusinessemail/${token.token}`,
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
      </div> 
      `,
    });

    hashedPassword = "";

    return res
      .status(200)
      .json({ message: "Verifying link is sent to Your Email" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const token = req.params.token;
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
    businessId.isVerified = true;
    businessId.save().then((business) => {
      if (!business) {
        return res.status(400).json({ error: "Failed to Verify" });
      } else {
        sendEmail({
          from: "beta.toursewa@gmail.com",
          to: "khagijora2074@gmail.com",
          subject: "New Business Registered",
          html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://tourbackend-rdtk.onrender.com/public/uploads/logo.png' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">A new business with business Id ${businessId.bId} has been registered</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              Please verify and activate the account from the admin side or activate directly from here.
            </p>
            <a href='${process.env.FRONTEND_URL}/businessapprove/${businessId.bId}' style="display: inline-block; background-color: #e6310b; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Verify and activate the account</a>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">
              This link will expire in 24 hours
            </p>
          </div>
        </div>
      </div> 
          `,
        });
        return res.status(200).json({ message: "Email Verified" });
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const businessProfile = async (req: Request, res: Response) => {
  const id = req.params.businessId;

  try {
    const data = await Business.findById(id);
    if (!data) {
      return res.status(404).json({ error: "Failed to get business Profile" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getBusiness = async (req: Request, res: Response) => {
  try {
    await Business.find().then((data) => {
      if (data.length > 0) {
        return res.send(data);
      } else {
        return res.status(400).json({ error: "Not Found" });
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error });
  }
};

export const updateBusinessProfile = async (req: Request, res: Response) => {
  const id = req.params.businessid;
  try {
    let imageGallery: string[] = req.body.existingImageGallery
      ? [...req.body.existingImageGallery]
      : [];
    let profileIcon: string | undefined = undefined;

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files["imageGallery"]) {
        const uploadedFiles = await Promise.all(
          files["imageGallery"].map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: "businessImages",
              use_filename: true,
              unique_filename: false,
            });
            return result.secure_url;
          })
        );
        imageGallery.push(...uploadedFiles);
      }

      if (files["profileIcon"]) {
        const result = await cloudinary.uploader.upload(
          files["profileIcon"][0].path,
          {
            folder: "businessIcons",
            use_filename: true,
            unique_filename: false,
          }
        );
        profileIcon = result.secure_url;

        // profileIcon = files["profileIcon"][0]?.path;
      }
    }
    const data = await Business.findByIdAndUpdate(
      id,
      {
        businessSubCategory: req.body.businessSubCategory,
        businessAddress: {
          street: req.body.businessAddress.street,

          city: req.body.businessAddress.city,
        },

        website: req.body.website,
        contactName: req.body.contactName,
        primaryPhone: req.body.primaryPhone,
        businessRegistration: {
          authority: req.body.businessRegistration.authority,

          registrationOn: req.body.businessRegistration.registrationOn,
          expiresOn: req.body.businessRegistration.expiresOn,
        },
        socialMedia: {
          platform: req.body.socialMedia.platform,
          url: req.body.socialMedia.url,
        },
        imageGallery,
        profileIcon,
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

export const deleteBusiness = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deleteBusiness = await Business.findByIdAndDelete(id);
    if (!deleteBusiness) {
      return res.status(404).json({ error: "Failed to delete" });
    }

    return res.status(200).json({ message: "Successfully Deleted" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const businessSignOut = async (req: Request, res: Response) => {
  const authToken = req.cookies.authToken;
  try {
    if (!authToken) {
      return res.status(400).json({ error: "signout request failed" });
    }
    res.clearCookie("authToken", {
      httpOnly: true,
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Sign out successful" });
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};

export const forgetPwd = async (req: Request, res: Response) => {
  const email = req.body.email;
  try {
    const businessEmail = await Business.findOne({
      primaryEmail: email,
    });
    if (businessEmail) {
      let token = new Token({
        token: uuid(),
        userId: businessEmail._id,
      });
      token = await token.save();
      if (!token) {
        return res.status(400).json({ error: "Token not generated" });
      }
      const url = `${process.env.FRONTEND_URL}/resetbusinesspwd/${token.token}`;
      const api = `${process.env.Backend_URL}`;
      sendEmail({
        from: "beta.toursewa@gmail.com",
        to: businessEmail.primaryEmail,
        subject: "Password Reset Link",
        text: `Reset password USing link below\n\n
    ${api}/resetbusinesspwd/${token.token}
    `,
        html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://tourbackend-rdtk.onrender.com/public/uploads/logo.png' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Reset Your Password</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              Incase you forget your account password you can reset it here.
            </p>
            <a href='${url}' style="display: inline-block; background-color: #e6310b; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Click to Reset</a>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">
              This link will expire in 24 hours
            </p>
          </div>
        </div>
      </div> `,
      });
      return res
        .status(200)
        .json({ message: "Password reset link sent to your email" });
    } else {
      const data = await User.findOne({ userEmail: email });
      if (data) {
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
          html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://tourbackend-rdtk.onrender.com/public/uploads/logo.png' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Reset Your Password</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              Incase you forget your account password you can reset it here.
            </p>
            <a href='${url}' style="display: inline-block; background-color: #e6310b; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Click to Reset</a>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">
              This link will expire in 24 hours
            </p>
          </div>
        </div>
      </div>`,
        });
        return res
          .status(200)
          .json({ message: "Password reset link sent to your email" });
      } else {
        const driver = await Driver.findOne({ driverEmail: email });
        if (driver) {
          let token = new Token({
            token: uuid(),
            userId: driver._id,
          });
          token = await token.save();
          if (!token) {
            return res.status(400).json({ error: "Token not generated" });
          }
          const url = `${process.env.FRONTEND_URL}/resetdriverpwd/${token.token}`;
          const api = `${process.env.Backend_URL}`;
          sendEmail({
            from: "beta.toursewa@gmail.com",
            to: driver.driverEmail,
            subject: "Password Reset Link",
            text: `Reset password USing link below\n\n
    ${api}/resetdriverpwd/${token.token}
    `,
            html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://tourbackend-rdtk.onrender.com/public/uploads/logo.png' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Reset Your Password</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              Incase you forget your account password you can reset it here.
            </p>
            <a href='${url}' style="display: inline-block; background-color: #e6310b; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Click to Reset</a>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">
              This link will expire in 24 hours
            </p>
          </div>
        </div>
      </div>`,
          });
          return res
            .status(200)
            .json({ message: "Password reset link sent to your email" });
        }
      }
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const resetPwd = async (req: Request, res: Response) => {
  const token = req.params.token;
  const newPwd = req.body.businessPwd;
  try {
    const data = await Token.findOne({ token });
    if (!data) {
      return res.status(404).json({ error: "Token not found" });
    }
    const businessId = await Business.findOne({ _id: data.userId });
    if (!businessId) {
      return res.status(404).json({ error: "Token and Email not matched" });
    }

    const isOldPwd = await bcryptjs.compare(newPwd, businessId.businessPwd);
    if (isOldPwd) {
      return res.status(400).json({ error: "Password Previously Used" });
    } else {
      const salt = await bcryptjs.genSalt(5);
      let hashedPwd = await bcryptjs.hash(newPwd, salt);
      businessId.businessPwd = hashedPwd;
      businessId.save();

      await Token.deleteOne({ _id: data._id });

      return res.status(201).json({ message: "Reset Successful" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const featureRequest = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { businessName, name, productId, price } = req.body;
  try {
    let data = new Feature({
      Id: id,
      businessName,
      name,
      productId,
      price,
    });
    data = await data.save();
    if (!data) {
      return res.status(400).json({ error: "Request Failed" });
    }

    return res.status(200).json({ message: "Request Send" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
