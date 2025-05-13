"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDest = exports.updateDest = exports.getDestById = exports.getDest = exports.addDest = exports.deleteBlogs = exports.updateBlogs = exports.getBlogsById = exports.getBlogs = exports.addBlogs = exports.deleteHero = exports.updateHero = exports.getHeroById = exports.getHero = exports.addHero = void 0;
const Hero_1 = __importDefault(require("../../models/Pages/LandingPage/Hero"));
const Blogs_1 = __importDefault(require("../../models/Pages/LandingPage/Blogs"));
const nanoid_1 = require("nanoid");
const Destination_1 = __importDefault(require("../../models/Pages/LandingPage/Destination"));
const BlogsLogs_1 = __importDefault(require("../../models/LogModel/BlogsLogs"));
const DestinationLogs_1 = __importDefault(require("../../models/LogModel/DestinationLogs"));
const cloudinary_1 = require("cloudinary");
//Dashboard Section
const addHero = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { heading, description } = req.body;
    try {
        if (!req.files || !req.files.heroImage) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        const fileArray = req.files;
        const files = Array.isArray(fileArray.heroImage)
            ? fileArray.heroImage
            : [fileArray.heroImage];
        if (!files) {
            return res.status(400).json({ message: "No image array uploaded" });
        }
        // let heroImage: string[] = [];
        // if (req.files) {
        //   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        //   if (files["heroImage"]) {
        //     heroImage = files["heroImage"].map((file) => file.path);
        //   }
        // }
        const uploadedImages = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield cloudinary_1.v2.uploader.upload(file.path, {
                folder: "DashboardImages",
                use_filename: true,
                unique_filename: false,
            });
            return result.secure_url;
        })));
        let hero = new Hero_1.default({
            heroImage: uploadedImages,
            heading,
            description,
        });
        hero = yield hero.save();
        if (!hero) {
            return res.status(400).json({ error: "Failed" });
        }
        else {
            return res.status(200).json({ message: "Saved" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.addHero = addHero;
const getHero = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let hero = yield Hero_1.default.find();
        if (hero.length > 0) {
            return res.send(hero);
        }
        else {
            return res.status(404).json({ error: "Failed to get image" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getHero = getHero;
const getHeroById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield Hero_1.default.findById(id);
        if (data) {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getHeroById = getHeroById;
const updateHero = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { heading, description } = req.body;
    try {
        let existingHeroImage = req.body.existingheroImage || [];
        let heroImage = existingHeroImage || [];
        // let heroImage: string[] = req.body.existingheroImage || [];
        // if (req.files) {
        //   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        //   if (files["heroImage"]) {
        //     const uploadedFiles = files["heroImage"].map((file) => file.path);
        //     heroImage.push(...uploadedFiles);
        //   }
        // }
        if (req.files && req.files.heroImage) {
            const fileArray = req.files;
            const files = Array.isArray(fileArray.heroImage)
                ? fileArray.heroImage
                : [fileArray.heroImage];
            const uploadedImages = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield cloudinary_1.v2.uploader.upload(file.path, {
                    folder: "DashboardImages",
                    use_filename: true,
                    unique_filename: false,
                });
                return result.secure_url;
            })));
            heroImage.push(...uploadedImages);
        }
        const hero = yield Hero_1.default.findByIdAndUpdate(id, {
            heroImage,
            heading,
            description,
        }, { new: true });
        if (!hero) {
            return res.status(400).json({
                error: "Failed to Update",
            });
        }
        else {
            return res.status(200).json({ message: "Successfully Updated" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.updateHero = updateHero;
const deleteHero = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        Hero_1.default.findByIdAndDelete(id).then((data) => {
            if (!data) {
                return res.status(404).json({ error: "Failed to delete" });
            }
            else {
                return res.status(200).json({ message: "Successfully Deleted" });
            }
        });
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.deleteHero = deleteHero;
//Blogs Section
const addBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, desc, updatedBy } = req.body;
    const customId = (0, nanoid_1.customAlphabet)("1234567890", 4);
    const blogId = customId();
    try {
        // let blogsImage: string[] = [];
        // if (req.files) {
        //   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        //   if (files["blogsImage"]) {
        //     blogsImage = files["blogsImage"].map((file) => file.path);
        //   }
        // }
        if (!req.files || !req.files.blogsImage) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        const fileArray = req.files;
        const files = Array.isArray(fileArray.blogsImage)
            ? fileArray.blogsImage
            : [fileArray.blogsImage];
        if (!files) {
            return res.status(400).json({ message: "No image array uploaded" });
        }
        const uploadedImages = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield cloudinary_1.v2.uploader.upload(file.path, {
                folder: "BlogImages",
                use_filename: true,
                unique_filename: false,
            });
            return result.secure_url;
        })));
        let blogs = new Blogs_1.default({
            title,
            desc,
            blogsImage: uploadedImages,
            blogId: blogId,
        });
        blogs = yield blogs.save();
        if (!blogs) {
            return res.status(400).json({ error: "failed to save" });
        }
        else {
            let blogsLog = new BlogsLogs_1.default({
                updatedBy: updatedBy,
                productId: blogId,
                action: "Added",
                time: new Date(),
            });
            blogsLog = yield blogsLog.save();
            return res.status(200).json({ message: "Added" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.addBlogs = addBlogs;
const getBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield Blogs_1.default.find();
        if (!data) {
            return res.status(404).json({ error: "failed" });
        }
        else {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getBlogs = getBlogs;
const getBlogsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield Blogs_1.default.findOne({ blogId: id });
        if (data) {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getBlogsById = getBlogsById;
const updateBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { title, desc, updatedBy } = req.body;
    try {
        // let blogsImage: string[] = req.body.existingblogsImage || [];
        // if (req.files) {
        //   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        //   if (files["blogsImage"]) {
        //     const uploadedFiles = files["blogsImage"].map((file) => file.path);
        //     blogsImage.push(...uploadedFiles);
        //   }
        // }
        let existingblogsImage = req.body.existingblogsImage || [];
        let blogsImage = existingblogsImage || [];
        if (req.files && req.files.blogsImage) {
            const fileArray = req.files;
            const files = Array.isArray(fileArray.blogsImage)
                ? fileArray.blogsImage
                : [fileArray.blogsImage];
            const uploadedImages = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield cloudinary_1.v2.uploader.upload(file.path, {
                    folder: "BlogImages",
                    use_filename: true,
                    unique_filename: false,
                });
                return result.secure_url;
            })));
            blogsImage.push(...uploadedImages);
        }
        const blogs = yield Blogs_1.default.findOneAndUpdate({ blogId: id }, {
            title,
            desc,
            blogsImage,
        }, { new: true });
        if (!blogs) {
            return res.status(400).json({
                error: "Failed to Update",
            });
        }
        else {
            let blogsLog = new BlogsLogs_1.default({
                updatedBy: updatedBy,
                productId: id,
                action: "Updated",
                time: new Date(),
            });
            blogsLog = yield blogsLog.save();
            return res.status(200).json({ message: "Successfully Updated" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.updateBlogs = updateBlogs;
const deleteBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { updatedBy } = req.query;
    try {
        Blogs_1.default.findByIdAndDelete(id).then((data) => __awaiter(void 0, void 0, void 0, function* () {
            if (!data) {
                return res.status(404).json({ error: "Failed to delete" });
            }
            else {
                let blogsLog = new BlogsLogs_1.default({
                    updatedBy: updatedBy,
                    productId: id,
                    action: "Deleted",
                    time: new Date(),
                });
                blogsLog = yield blogsLog.save();
                return res.status(200).json({ message: "Successfully Deleted" });
            }
        }));
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.deleteBlogs = deleteBlogs;
//Popular Destination Section
const addDest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, updatedBy } = req.body;
    const customId = (0, nanoid_1.customAlphabet)("1234567890", 4);
    const destId = customId();
    try {
        // let destImage: string[] = [];
        // if (req.files) {
        //   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        //   if (files["destImage"]) {
        //     destImage = files["destImage"].map((file) => file.path);
        //   }
        // }
        if (!req.files || !req.files.destImage) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        const fileArray = req.files;
        const files = Array.isArray(fileArray.destImage)
            ? fileArray.destImage
            : [fileArray.destImage];
        if (!files) {
            return res.status(400).json({ message: "No image array uploaded" });
        }
        const uploadedImages = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield cloudinary_1.v2.uploader.upload(file.path, {
                folder: "DestinationImages",
                use_filename: true,
                unique_filename: false,
            });
            return result.secure_url;
        })));
        let dest = new Destination_1.default({
            title,
            destImage: uploadedImages,
            destId: destId,
        });
        dest = yield dest.save();
        if (!dest) {
            return res.status(400).json({ error: "failed to save" });
        }
        else {
            let destLog = new DestinationLogs_1.default({
                updatedBy: updatedBy,
                productId: destId,
                action: "Added",
                time: new Date(),
            });
            destLog = yield destLog.save();
            return res.status(200).json({ message: "Added" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.addDest = addDest;
const getDest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield Destination_1.default.find();
        if (!data) {
            return res.status(404).json({ error: "failed" });
        }
        else {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: "ror" });
    }
});
exports.getDest = getDest;
const getDestById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        let data = yield Destination_1.default.findOne({ destId: id });
        if (data) {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getDestById = getDestById;
const updateDest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { title, updatedBy } = req.body;
    try {
        // let destImage: string[] = req.body.existingdestImage || [];
        // if (req.files) {
        //   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        //   if (files["destImage"]) {
        //     const uploadedFiles = files["destImage"].map((file) => file.path);
        //     destImage.push(...uploadedFiles);
        //   }
        // }
        let existingdestImage = req.body.existingdestImage || [];
        let destImage = existingdestImage || [];
        if (req.files && req.files.destImage) {
            const fileArray = req.files;
            const files = Array.isArray(fileArray.destImage)
                ? fileArray.destImage
                : [fileArray.destImage];
            const uploadedImages = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield cloudinary_1.v2.uploader.upload(file.path, {
                    folder: "DestinationImages",
                    use_filename: true,
                    unique_filename: false,
                });
                return result.secure_url;
            })));
            destImage.push(...uploadedImages);
        }
        const dest = yield Blogs_1.default.findOneAndUpdate({ destId: id }, {
            title,
            destImage,
        }, { new: true });
        if (!dest) {
            return res.status(400).json({
                error: "Failed to Update",
            });
        }
        else {
            let destLog = new DestinationLogs_1.default({
                updatedBy: updatedBy,
                productId: id,
                action: "Updated",
                time: new Date(),
            });
            destLog = yield destLog.save();
            return res.status(200).json({ message: "Successfully Updated" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.updateDest = updateDest;
const deleteDest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { updatedBy } = req.query;
    try {
        Destination_1.default.findByIdAndDelete(id).then((data) => __awaiter(void 0, void 0, void 0, function* () {
            if (!data) {
                return res.status(404).json({ error: "Failed to delete" });
            }
            else {
                let destLog = new DestinationLogs_1.default({
                    updatedBy: updatedBy,
                    productId: id,
                    action: "Deleted",
                    time: new Date(),
                });
                destLog = yield destLog.save();
                return res.status(200).json({ message: "Successfully Deleted" });
            }
        }));
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.deleteDest = deleteDest;
