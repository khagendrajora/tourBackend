import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import Business from "../models/business";
import jwt from "jsonwebtoken";
import BusinessProfile from "../models/businessProfine";
import Token from "../models/token";
import { v4 as uuid } from "uuid";
import { sendEmail } from "../utils/setEmail";

export const addBusiness = async (req: Request, res: Response) => {
  const {
    businessName,
    businessCategory,
    taxRegistration,
    address,
    primaryEmail,
    primaryPhone,
    password,
  } = req.body;

  try {
    if (password == "") {
      return res.status(400).json({ error: "password is reqired" });
    }
    const tax = await Business.findOne({ taxRegistration });
    if (tax) {
      return res
        .status(400)
        .json({ error: "Registration Number is already Used" });
    }

    const email = await Business.findOne({ primaryEmail });
    if (email) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const phone = await Business.findOne({ primaryPhone });
    if (phone) {
      return res
        .status(400)
        .json({ error: "Phone Number already registered " });
    }

    const salt = await bcryptjs.genSalt(5);
    let hashedPassword = await bcryptjs.hash(password, salt);
    let business = new Business({
      businessName,
      businessCategory,
      taxRegistration,
      address,
      primaryEmail,
      primaryPhone,
      password: hashedPassword,
    });
    business = await business.save();

    if (!business) {
      hashedPassword = "";
      return res.status(400).json({ error: "Failed to save the business" });
    } else {
      hashedPassword = "";
      return res.status(200).json({ message: "Business Added succesfully" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const businessLogin = async (req: Request, res: Response) => {
  const { businessId, primaryEmail, primaryPhone, password } = req.body;

  try {
    const businessid = await Business.findOne({ _id: businessId });
    if (!businessid) {
      return res.status(404).json({
        error: "Business Id not found",
        businessid: businessid,
      });
    }
    if (businessid.primaryEmail !== primaryEmail) {
      return res.status(400).json({
        error: "Email not matched",
        primaryEmail: primaryEmail,
        businessEmail: businessid.primaryEmail,
      });
    }
    const isPassword = await bcryptjs.compare(password, businessid.password);

    if (!isPassword) {
      return res.status(400).json({ error: "password  not matched" });
    }

    if (businessid.primaryPhone !== primaryPhone) {
      return res.status(400).json({ error: "Phone number  not matched" });
    }
    const data = { id: businessid._id };
    const authToken = jwt.sign(data, process.env.JWTSECRET as string);
    res.cookie("authToken", authToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600000,
    });
    return res.status(200).json({
      message: "Login succssfully",
      authToken: authToken,
      businesId: businessid._id,
      primaryEmail: primaryEmail,
      primaryPhone: primaryPhone,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const businessProfile = async (req: Request, res: Response) => {
  const id = req.params.businessId;

  try {
    const authToken = req.cookies.authToken;
    if (!authToken) {
      return res.status(400).json({ error: "Session Expired" });
    }
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
      if (!data) {
        return res.status(400).json({ error: "Failed to get business" });
      } else {
        return res.send(data);
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error });
  }
};

export const addbusinessProfile = async (req: Request, res: Response) => {
  const authToken = req.cookies.authToken;
  if (!authToken) {
    return res
      .status(400)
      .json({ error: "Token not found, first login with business ID " });
  }
  const { businessSubcategory, Website, contactName } = req.body;

  const { Address, country, state, city } = req.body.businessAddress;
  const { authority, registrationNumber, registrationOn, expiresOn } =
    req.body.businessRegistration;

  const { platform } = req.body.socialMedia;

  try {
    const decodedToken = jwt.verify(
      authToken,
      process.env.JWTSECRET as string
    ) as { id: string };
    const businessId = decodedToken.id;

    const data = await Business.findOne({ _id: businessId });

    if (!data) {
      return res.status(400).json({
        error: "Failed to fetch Business Data",
        businessId: businessId,
      });
    }

    let imageGallery: string[] = [];
    let profileIcon: string | undefined = undefined;

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files["imageGallery"]) {
        imageGallery = files["imageGallery"].map((file) => file.path);
      }

      if (files["profileIcon"]) {
        profileIcon = files["profileIcon"][0]?.path;
      }
    }

    const businessProfile = new BusinessProfile({
      businessId: data._id,
      businessName: data.businessName,
      businessCategory: data.businessCategory,
      businessSubcategory,
      businessAddress: {
        Address,
        country,
        state,
        city,
      },
      email: data.primaryEmail,
      Website,
      contactName,
      phone: data.primaryPhone,
      businessRegistration: {
        authority,
        registrationNumber,
        registrationOn,
        expiresOn,
      },
      socialMedia: {
        platform,
      },
      imageGallery,
      profileIcon,
    });

    const savedData = await businessProfile.save();
    if (!savedData) {
      return res.status(400).json({ error: "failed to save" });
    } else {
      return res.send(savedData);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getBusinessProfile = async (req: Request, res: Response) => {
  const businessId = req.params.businessId;
  try {
    const data = await BusinessProfile.findOne({ businessId });
    if (!data) {
      return res
        .status(404)
        .json({ error: "Failed to get business full Profile" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getBusinessProfileDetails = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  try {
    const data = await BusinessProfile.findById(id);
    if (!data) {
      return res
        .status(404)
        .json({ error: "Failed to get business Profile Data" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateBusinessProfile = async (req: Request, res: Response) => {
  // const authToken = req.cookies.authToken;
  // if (!authToken) {
  //   return res
  //     .status(400)
  //     .json({ error: "Token not found, first login with business ID " });
  // }
  const id = req.params.profileId;
  try {
    const imageGallery: string[] = req.body.existingImageGallery || [];
    let profileIcon: string | undefined = undefined;

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files["imageGallery"]) {
        const uploadedFiles = files["imageGallery"].map((file) => file.path);
        imageGallery.push(...uploadedFiles);
      }

      if (files["profileIcon"]) {
        profileIcon = files["profileIcon"][0]?.path;
      }
    }
    const data = await BusinessProfile.findByIdAndUpdate(
      id,
      {
        businessId: req.body.businessId,
        businessName: req.body.businessName,
        businessCategory: req.body.businessCategory,
        businessSubcategory: req.body.businessSubcategory,
        businessAddress: {
          Address: req.body.businessAddress.Address,
          country: req.body.businessAddress.country,
          state: req.body.businessAddress.state,
          city: req.body.businessAddress.city,
        },
        email: req.body.email,
        Website: req.body.Website,
        contactName: req.body.contactName,
        phone: req.body.phone,
        businessRegistration: {
          authority: req.body.businessRegistration.authority,
          registrationNumber: req.body.businessRegistration.registrationNumber,
          registrationOn: req.body.businessRegistration.registrationOn,
          expiresOn: req.body.businessRegistration.expiresOn,
        },
        socialMedia: {
          platform: req.body.socialMedia.platform,
        },
        imageGallery,
        profileIcon,
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({
        error: "failed",
      });
    } else {
      const newData = await Business.findByIdAndUpdate(
        req.body.businessId,
        {
          businessName: req.body.businessName,
          businessCategory: req.body.businessCategory,
          address: req.body.businessAddress.Address,
          primaryEmail: req.body.email,
          primaryPhone: req.body.phone,
        },
        { new: true }
      );
      return res.send({
        data: data,
        newData: newData,
      });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteBusiness = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await Business.findByIdAndDelete(id).then(async (data) => {
      if (!data) {
        return res.status(404).json({ error: "Failed to delete" });
      } else {
        await BusinessProfile.findByIdAndDelete({ id }).then((data) => {
          if (!data) {
            return res.status(404).json({ error: "Failed to delete" });
          } else {
            return res.status(200).json({ message: "Successfully Deleted" });
          }
        });
      }
    });
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
  let primaryEmail = req.body.primaryEmail;
  try {
    const data = await Business.findOne({ primaryEmail });
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
    const url = `${process.env.FRONTEND_URL}/resetbusinesspwd/${token.token}`;
    const api = `${process.env.Backend_URL}`;
    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: data.primaryEmail,
      subject: "Password Reset Link",
      text: `Reset password USing link below\n\n
    ${api}/resetbusinesspwd/${token.token}
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
  const newPwd = req.body.password;
  try {
    const data = await Token.findOne({ token });
    if (!data) {
      return res.status(404).json({ error: "Token not found" });
    }
    const businessId = await Business.findOne({ _id: data.userId });
    if (!businessId) {
      return res.status(404).json({ error: "Token and Email not matched" });
    } else {
      const salt = await bcryptjs.genSalt(5);
      let hashedPwd = await bcryptjs.hash(newPwd, salt);
      businessId.password = hashedPwd;
      businessId.save();

      await Token.deleteOne({ _id: data._id });

      return res.status(201).json({ message: "Reset Successful" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
