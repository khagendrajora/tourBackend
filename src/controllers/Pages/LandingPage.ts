import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import fs from "fs";
import Hero from "../../models/Pages/LandingPage/Hero";
import Blogs from "../../models/Pages/LandingPage/Blogs";
import { customAlphabet } from "nanoid";
import path from "path";
import Destination from "../../models/Pages/LandingPage/Destination";
import BlogsLogs from "../../models/LogModel/BlogsLogs";
import DestinationLogs from "../../models/LogModel/DestinationLogs";

export const addHero = async (req: Request, res: Response) => {
  const { heading, description } = req.body;
  try {
    let heroImage: string[] = [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["heroImage"]) {
        heroImage = files["heroImage"].map((file) => file.path);
      }
    }
    let hero = new Hero({
      heroImage,
      heading,
      description,
    });
    hero = await hero.save();
    if (!hero) {
      return res.status(400).json({ error: "Failed" });
    } else {
      return res.status(200).json({ message: "Saved" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};

export const getHero = async (req: Request, res: Response) => {
  try {
    let hero = await Hero.find();
    if (hero.length > 0) {
      return res.send(hero);
    } else {
      return res.status(404).json({ error: "Failed to get image" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const getHeroById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await Hero.findById(id);
    if (data) {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const updateHero = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { heading, description } = req.body;

  try {
    let heroImage: string[] = req.body.existingheroImage || [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["heroImage"]) {
        const uploadedFiles = files["heroImage"].map((file) => file.path);
        heroImage.push(...uploadedFiles);
      }
    }
    const hero = await Hero.findByIdAndUpdate(
      id,
      {
        heroImage,
        heading,
        description,
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

export const addBlogs = async (req: Request, res: Response) => {
  const { title, desc, updatedBy } = req.body;
  const customId = customAlphabet("1234567890", 4);
  const blogId = customId();

  try {
    let blogsImage: string[] = [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["blogsImage"]) {
        blogsImage = files["blogsImage"].map((file) => file.path);
      }
    }
    let blogs = new Blogs({
      title,
      desc,
      blogsImage,
      blogId: blogId,
    });
    blogs = await blogs.save();
    if (!blogs) {
      return res.status(400).json({ error: "failed to save" });
    } else {
      let blogsLog = new BlogsLogs({
        updatedBy: updatedBy,
        productId: blogId,
        action: "Added",
        time: new Date(),
      });
      blogsLog = await blogsLog.save();
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

export const getBlogsById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await Blogs.findOne({ blogId: id });
    if (data) {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const updateBlogs = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { title, desc, updatedBy } = req.body;

  try {
    let blogsImage: string[] = req.body.existingblogsImage || [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["blogsImage"]) {
        const uploadedFiles = files["blogsImage"].map((file) => file.path);
        blogsImage.push(...uploadedFiles);
      }
    }
    const blogs = await Blogs.findOneAndUpdate(
      { blogId: id },
      {
        title,
        desc,
        blogsImage,
      },
      { new: true }
    );

    if (!blogs) {
      return res.status(400).json({
        error: "Failed to Update",
      });
    } else {
      let blogsLog = new BlogsLogs({
        updatedBy: updatedBy,
        productId: id,
        action: "Updated",
        time: new Date(),
      });
      blogsLog = await blogsLog.save();
      return res.status(200).json({ message: "Successfully Updated" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const deleteBlogs = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { updatedBy } = req.query;
  try {
    Blogs.findByIdAndDelete(id).then(async (data) => {
      if (!data) {
        return res.status(404).json({ error: "Failed to delete" });
      } else {
        let blogsLog = new BlogsLogs({
          updatedBy: updatedBy,
          productId: id,
          action: "Deleted",
          time: new Date(),
        });
        blogsLog = await blogsLog.save();
        return res.status(200).json({ message: "Successfully Deleted" });
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const addDest = async (req: Request, res: Response) => {
  const { title, updatedBy } = req.body;
  const customId = customAlphabet("1234567890", 4);
  const destId = customId();

  try {
    let destImage: string[] = [];
    const uploadDir = path.join(__dirname, "../public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    if (req.files && "destImage" in req.files) {
      const uploadedFiles = req.files.destImage as unknown as
        | UploadedFile
        | UploadedFile[];

      if (Array.isArray(uploadedFiles)) {
        // Multiple files
        for (const file of uploadedFiles) {
          const uploadPath = path.join(
            __dirname,
            "../public/uploads",
            file.name
          );
          await file.mv(uploadPath);
          destImage.push(`/public/uploads/${file.name}`);
        }
      } else {
        // Single file
        const uploadPath = path.join(
          uploadDir,

          uploadedFiles.name
        );
        await uploadedFiles.mv(uploadPath);
        destImage.push(`/public/uploads/${uploadedFiles.name}`);
      }
    }
    // if (req.files) {
    //   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    //   if (files["destImage"]) {
    //     destImage = files["destImage"].map((file) => file.path);
    //   }
    // }
    let dest = new Destination({
      title,
      destImage,
      destId: destId,
    });
    dest = await dest.save();
    if (!dest) {
      return res.status(400).json({ error: "failed to save" });
    } else {
      let destLog = new DestinationLogs({
        updatedBy: updatedBy,
        productId: destId,
        action: "Added",
        time: new Date(),
      });
      destLog = await destLog.save();
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
export const getDestById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    let data = await Destination.findOne({ destId: id });
    if (data) {
      return res.send(data);
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const updateDest = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { title, updatedBy } = req.body;

  try {
    let destImage: string[] = req.body.existingdestImage || [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files["destImage"]) {
        const uploadedFiles = files["destImage"].map((file) => file.path);
        destImage.push(...uploadedFiles);
      }
    }
    const dest = await Blogs.findOneAndUpdate(
      { destId: id },
      {
        title,
        destImage,
      },
      { new: true }
    );

    if (!dest) {
      return res.status(400).json({
        error: "Failed to Update",
      });
    } else {
      let destLog = new DestinationLogs({
        updatedBy: updatedBy,
        productId: id,
        action: "Updated",
        time: new Date(),
      });
      destLog = await destLog.save();
      return res.status(200).json({ message: "Successfully Updated" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};

export const deleteDest = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { updatedBy } = req.query;
  try {
    Destination.findByIdAndDelete(id).then(async (data) => {
      if (!data) {
        return res.status(404).json({ error: "Failed to delete" });
      } else {
        let destLog = new DestinationLogs({
          updatedBy: updatedBy,
          productId: id,
          action: "Deleted",
          time: new Date(),
        });
        destLog = await destLog.save();
        return res.status(200).json({ message: "Successfully Deleted" });
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: "internal error" });
  }
};
