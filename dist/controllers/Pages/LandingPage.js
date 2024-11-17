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
exports.deleteDest = exports.updateDest = exports.getDest = exports.addDest = exports.deleteBlogs = exports.updateBlogs = exports.getBlogs = exports.addBlogs = exports.deleteHotDeals = exports.updateHotdeals = exports.getHotDeals = exports.addHotDeals = exports.deleteHero = exports.updateHero = exports.getHero = exports.addHero = void 0;
const Hero_1 = __importDefault(require("../../models/Pages/LandingPage/Hero"));
const AboutUs_1 = __importDefault(require("../../models/Pages/LandingPage/AboutUs"));
const Blogs_1 = __importDefault(require("../../models/Pages/LandingPage/Blogs"));
const { customAlphabet } = require("nanoid");
const Destination_1 = __importDefault(require("../../models/Pages/LandingPage/Destination"));
const addHero = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        });
        hero = yield hero.save();
        if (!hero) {
            return res.status(400).json({ error: "failed to save" });
        }
        else {
            return res.status(200).json({ message: "Added" });
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
        if (!hero) {
            return res.status(404).json({ error: "Failed to get image" });
        }
        else {
            return res.send(hero);
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getHero = getHero;
const updateHero = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
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
const addHotDeals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startingPrice, sourceAddress, destAddress, vehicle, travelName } = req.body;
    try {
        let data = new AboutUs_1.default({
            startingPrice,
            sourceAddress,
            destAddress,
            vehicle,
            travelName,
        });
        data = yield data.save();
        if (!data) {
            return res.status(400).json({ error: "failed to save" });
        }
        else {
            return res.status(200).json({ message: "Added" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.addHotDeals = addHotDeals;
const getHotDeals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield AboutUs_1.default.find();
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
exports.getHotDeals = getHotDeals;
const updateHotdeals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let { startingPrice, sourceAddress, destAddress, vehicle, travelName } = req.body;
    try {
        const aboutUS = yield AboutUs_1.default.findByIdAndUpdate(id, {
            startingPrice,
            sourceAddress,
            destAddress,
            vehicle,
            travelName,
        }, { new: true });
        if (!aboutUS) {
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
exports.updateHotdeals = updateHotdeals;
const deleteHotDeals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        AboutUs_1.default.findByIdAndDelete(id).then((data) => {
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
exports.deleteHotDeals = deleteHotDeals;
const addBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, desc } = req.body;
    const customId = customAlphabet("1234567890", 4);
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
const updateBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { title, desc } = req.body;
    try {
        let blogsImage = req.body.existingblogsImage || [];
        if (req.files) {
            const files = req.files;
            if (files["blogsImage"]) {
                const uploadedFiles = files["blogsImage"].map((file) => file.path);
                blogsImage.push(...uploadedFiles);
            }
        }
        const blogs = yield Blogs_1.default.findByIdAndUpdate(id, {
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
    try {
        Blogs_1.default.findByIdAndDelete(id).then((data) => {
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
exports.deleteBlogs = deleteBlogs;
const addDest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.body;
    const customId = customAlphabet("1234567890", 4);
    const destgId = customId();
    try {
        let destImage = [];
        if (req.files) {
            const files = req.files;
            if (files["destImage"]) {
                destImage = files["destImage"].map((file) => file.path);
            }
        }
        let dest = new Destination_1.default({
            title,
            destImage,
            destgId: destgId,
        });
        dest = yield dest.save();
        if (!dest) {
            return res.status(400).json({ error: "failed to save" });
        }
        else {
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
const updateDest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { title } = req.body;
    try {
        let destImage = req.body.existingdestImage || [];
        if (req.files) {
            const files = req.files;
            if (files["destImage"]) {
                const uploadedFiles = files["destImage"].map((file) => file.path);
                destImage.push(...uploadedFiles);
            }
        }
        const dest = yield Blogs_1.default.findByIdAndUpdate(id, {
            title,
            destImage,
        }, { new: true });
        if (!dest) {
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
exports.updateDest = updateDest;
const deleteDest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        Destination_1.default.findByIdAndDelete(id).then((data) => {
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
exports.deleteDest = deleteDest;
