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

export const updateHero = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    let hero_image: string[] = req.body.existinghero_image || [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["hero_image"]) {
        const uploadedFiles = files["hero_image"].map((file) => file.path);
        hero_image.push(...uploadedFiles);
      }
    }
    const hero = await Hero.findByIdAndUpdate(
      id,
      {
        hero_image,
      },
      { new: true }
    );

    if (!hero) {
      return res.status(400).json({
        error: "Failed to Update",
      });
    } else {
      return res.status(200).json({ message: "Successfully Updated" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const deleteHero = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    Hero.findByIdAndDelete(id).then((data) => {
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

export const updateAboutUS = async (req: Request, res: Response) => {
  const id = req.params.id;
  let { starting_price, source_dest, dest, vehicle, travel_name } = req.body;
  try {
    const aboutUS = await AboutUs.findByIdAndUpdate(
      id,
      {
        starting_price,
        source_dest,
        dest,
        vehicle,
        travel_name,
      },
      { new: true }
    );
    if (!aboutUS) {
      return res.status(400).json({
        error: "Failed to Update",
      });
    } else {
      return res.status(200).json({ message: "Successfully Updated" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const deleteAboutUs = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    AboutUs.findByIdAndDelete(id).then((data) => {
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

export const updateBlogs = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { title, desc } = req.body;

  try {
    let blogs_image: string[] = req.body.existingblogs_image || [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["blogs_image"]) {
        const uploadedFiles = files["blogs_image"].map((file) => file.path);
        blogs_image.push(...uploadedFiles);
      }
    }
    const blogs = await Blogs.findByIdAndUpdate(
      id,
      {
        title,
        desc,
        blogs_image,
      },
      { new: true }
    );

    if (!blogs) {
      return res.status(400).json({
        error: "Failed to Update",
      });
    } else {
      return res.status(200).json({ message: "Successfully Updated" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const deleteBlogs = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    Blogs.findByIdAndDelete(id).then((data) => {
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

export const updateDest = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { title } = req.body;

  try {
    let dest_image: string[] = req.body.existingdest_image || [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["dest_image"]) {
        const uploadedFiles = files["dest_image"].map((file) => file.path);
        dest_image.push(...uploadedFiles);
      }
    }
    const dest = await Destination.findByIdAndUpdate(
      id,
      {
        title,
        dest_image,
      },
      { new: true }
    );

    if (!dest) {
      return res.status(400).json({
        error: "Failed to Update",
      });
    } else {
      return res.status(200).json({ message: "Successfully Updated" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const deleteDest = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    Destination.findByIdAndDelete(id).then((data) => {
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
