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
const path_1 = __importDefault(require("path"));
const Destination_1 = __importDefault(require("../../models/Pages/LandingPage/Destination"));
const BlogsLogs_1 = __importDefault(require("../../models/LogModel/BlogsLogs"));
const DestinationLogs_1 = __importDefault(require("../../models/LogModel/DestinationLogs"));
const addHero = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { heading, description } = req.body;
    try {
        let heroImage = [];
        if (req.files) {
            const files = req.files;
            if (files["heroImage"]) {
                heroImage = files["heroImage"].map((file) => file.path);
            }
        }
        let hero = new Hero_1.default({
            heroImage,
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
        let heroImage = req.body.existingheroImage || [];
        if (req.files) {
            const files = req.files;
            if (files["heroImage"]) {
                const uploadedFiles = files["heroImage"].map((file) => file.path);
                heroImage.push(...uploadedFiles);
            }
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
const addBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, desc, updatedBy } = req.body;
    const customId = (0, nanoid_1.customAlphabet)("1234567890", 4);
    const blogId = customId();
    try {
        let blogsImage = [];
        if (req.files) {
            const files = req.files;
            if (files["blogsImage"]) {
                blogsImage = files["blogsImage"].map((file) => file.path);
            }
        }
        let blogs = new Blogs_1.default({
            title,
            desc,
            blogsImage,
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
        let blogsImage = req.body.existingblogsImage || [];
        if (req.files) {
            const files = req.files;
            if (files["blogsImage"]) {
                const uploadedFiles = files["blogsImage"].map((file) => file.path);
                blogsImage.push(...uploadedFiles);
            }
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
const addDest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, updatedBy } = req.body;
    const customId = (0, nanoid_1.customAlphabet)("1234567890", 4);
    const destId = customId();
    try {
        let destImage = [];
        if (req.files && "destImage" in req.files) {
            const uploadedFiles = req.files.destImage;
            if (Array.isArray(uploadedFiles)) {
                // Multiple files
                for (const file of uploadedFiles) {
                    const uploadPath = path_1.default.join(__dirname, "../public/uploads", file.name);
                    yield file.mv(uploadPath);
                    destImage.push(`/public/uploads/${file.name}`);
                }
            }
            else {
                // Single file
                const uploadPath = path_1.default.join(__dirname, "../public/uploads", uploadedFiles.name);
                yield uploadedFiles.mv(uploadPath);
                destImage.push(`/public/uploads/${uploadedFiles.name}`);
            }
        }
        // if (req.files) {
        //   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        //   if (files["destImage"]) {
        //     destImage = files["destImage"].map((file) => file.path);
        //   }
        // }
        let dest = new Destination_1.default({
            title,
            destImage,
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
        return res.status(500).json({ error: "internal error" });
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
        let destImage = req.body.existingdestImage || [];
        if (req.files) {
            const files = req.files;
            if (files["destImage"]) {
                const uploadedFiles = files["destImage"].map((file) => file.path);
                destImage.push(...uploadedFiles);
            }
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
