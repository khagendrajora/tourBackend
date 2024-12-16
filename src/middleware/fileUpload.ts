import multer, { diskStorage } from "multer";
import { Request } from "express";
import fs from "fs";
import path from "path";

const storage = diskStorage({
  destination: function (req, file, cb) {
    let fileDestination = "public/uploads";
    if (!fs.existsSync(fileDestination)) {
      fs.mkdirSync(fileDestination, { recursive: true });
      cb(null, fileDestination);
    } else {
      cb(null, fileDestination);
    }
  },
  filename: function (req, file, cb) {
    let filename = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    let extnam = path.extname(file.originalname);
    cb(null, filename + "_" + Date.now() + extnam);
  },
});

const imageFilter = (req: Request, file: any, cb: any) => {
  if (
    !file.originalname.match(/\.(jpg|png|jpeg|webp|gif|JPG|PNG|JPEG|xlsx|csv)$/)
  ) {
    return cb(
      new Error("Only jpg|png|jpeg|webp|gif|JPG|PNG|JPEG are supported")
    );
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
});

export default upload;
