import { Request, Response } from "express";
import Hero from "../../models/Pages/LandingPage/Hero";
import AboutUs from "../../models/Pages/LandingPage/AboutUs";
import Blogs from "../../models/Pages/LandingPage/Blogs";
import Destination from "../../models/Pages/LandingPage/Destination";

export const addHero = async (req: Request, res: Response) => {
  try {
    let hero_image: string[] = [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["hero_image"]) {
        hero_image = files["hero_image"].map((file) => file.path);
      }
    }
    let hero = new Hero({
      hero_image,
    });
    hero = await hero.save();
    if (!hero) {
      return res.status(400).json({ error: "failed to save" });
    } else {
      return res.status(200).json({ message: "Added" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};

export const getHero = async (req: Request, res: Response) => {
  try {
    let hero = await Hero.find();
    if (!hero) {
      return res.status(404).json({ error: "Failed to get image" });
    } else {
      return res.send(hero);
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const updateHero = async (req: Request, res: Response) => {};

export const addAboutUs = async (req: Request, res: Response) => {
  const { starting_price, source_dest, dest, vehicle, travel_name } = req.body;
  try {
    let data = new AboutUs({
      starting_price,
      source_dest,
      dest,
      vehicle,
      travel_name,
    });
    data = await data.save();
    if (!data) {
      return res.status(400).json({ error: "failed to save" });
    } else {
      return res.status(200).json({ message: "Added" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};

export const getAboutUs = async (req: Request, res: Response) => {
  try {
    let data = await AboutUs.find();
    if (!data) {
      return res.status(404).json({ error: "failed" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const updateAboutUS = async (req: Request, res: Response) => {};

export const addBlogs = async (req: Request, res: Response) => {
  const { title, desc } = req.body;
  try {
    let blogs_image: string[] = [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["blogs_image"]) {
        blogs_image = files["blogs_image"].map((file) => file.path);
      }
    }
    let blogs = new Blogs({
      title,
      desc,
      blogs_image,
    });
    blogs = await blogs.save();
    if (!blogs) {
      return res.status(400).json({ error: "failed to save" });
    } else {
      return res.status(200).json({ message: "Added" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};

export const getBlogs = async (req: Request, res: Response) => {
  try {
    let data = await Blogs.find();
    if (!data) {
      return res.status(404).json({ error: "failed" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const updateBlogs = async (req: Request, res: Response) => {};

export const addDest = async (req: Request, res: Response) => {
  const { title } = req.body;
  try {
    let dest_image: string[] = [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["dest_image"]) {
        dest_image = files["dest_image"].map((file) => file.path);
      }
    }
    let dest = new Destination({
      title,
      dest_image,
    });
    dest = await dest.save();
    if (!dest) {
      return res.status(400).json({ error: "failed to save" });
    } else {
      return res.status(200).json({ message: "Added" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};

export const getDest = async (req: Request, res: Response) => {
  try {
    let data = await Destination.find();
    if (!data) {
      return res.status(404).json({ error: "failed" });
    } else {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const updateDest = async (req: Request, res: Response) => {};
