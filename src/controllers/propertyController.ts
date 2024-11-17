import { Request, Response } from "express";
import Property from "../models/property";
const { customAlphabet } = require("nanoid");

export const addProperty = async (req: Request, res: Response) => {
  const customId = customAlphabet("1234567890", 4);
  const propertyId = customId();
  const {
    propName,
    propCategory,
    propSubCategory,
    email,
    website,
    phone,
    businessReg,
    tax,
    contactName,
    contactPhone,
    dateOfEstab,
  } = req.body;

  const { country, state, district, municipality, street, subrub, postcode } =
    req.body.address;
  try {
    const property = new Property({
      propName,
      propCategory,
      propSubCategory,
      propertyId: propertyId,
      email,
      website,
      phone,
      businessReg,
      tax,
      contactName,
      contactPhone,
      dateOfEstab,
      address: {
        country,
        state,
        district,
        municipality,
        street,
        subrub,
        postcode,
      },
    });
    const savedData = await property.save();
    if (!savedData) {
      return res.status(400).json({ error: "failed to save" });
    } else {
      return res.status(200).json({ message: "success" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  const id = req.params.id;
  const {
    propName,
    propCategory,
    propSubCategory,
    email,
    website,
    phone,
    businessReg,
    tax,
    contactName,
    contactPhone,
    dateOfEstab,
  } = req.body;

  const { country, state, district, municipality, street, subrub, postcode } =
    req.body.address;
  try {
    const data = await Property.findByIdAndUpdate(
      id,
      {
        propName,
        propCategory,
        propSubCategory,
        email,
        website,
        phone,
        businessReg,
        tax,
        contactName,
        contactPhone,
        dateOfEstab,
        address: {
          country,
          state,
          district,
          municipality,
          street,
          subrub,
          postcode,
        },
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({
        error: "failed",
      });
    } else {
      return res.status(200).json({ message: "success" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getProperty = async (req: Request, res: Response) => {
  try {
    let property = await Property.find();
    if (property.length === 0) {
      return res.send(property);
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const propertyDetails = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const data = await Property.findById(id);
    if (!data) {
      return res.status(404).json({ error: "Failed to get Property" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await Property.findByIdAndDelete(id).then((data) => {
      if (!data) {
        return res.status(404).json({ error: "Failed to delete" });
      } else {
        return res.status(200).json({ message: "Successfully Deleted" });
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};
