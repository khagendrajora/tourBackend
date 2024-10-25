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
exports.deleteDest = exports.updateDest = exports.getDest = exports.addDest = exports.deleteBlogs = exports.updateBlogs = exports.getBlogs = exports.addBlogs = exports.deleteAboutUs = exports.updateAboutUS = exports.getAboutUs = exports.addAboutUs = exports.deleteHero = exports.updateHero = exports.getHero = exports.addHero = void 0;
const Hero_1 = __importDefault(require("../../models/Pages/LandingPage/Hero"));
const AboutUs_1 = __importDefault(require("../../models/Pages/LandingPage/AboutUs"));
const Blogs_1 = __importDefault(require("../../models/Pages/LandingPage/Blogs"));
const Destination_1 = __importDefault(require("../../models/Pages/LandingPage/Destination"));
const addHero = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let hero_image = [];
        if (req.files) {
            const files = req.files;
            if (files["hero_image"]) {
                hero_image = files["hero_image"].map((file) => file.path);
            }
        }
        let hero = new Hero_1.default({
            hero_image,
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
const updateHero = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
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
const addAboutUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { starting_price, source_dest, dest, vehicle, travel_name } = req.body;
    try {
        let data = new AboutUs_1.default({
            starting_price,
            source_dest,
            dest,
            vehicle,
            travel_name,
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
exports.addAboutUs = addAboutUs;
const getAboutUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getAboutUs = getAboutUs;
const updateAboutUS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let { starting_price, source_dest, dest, vehicle, travel_name } = req.body;
    try {
        const aboutUS = yield AboutUs_1.default.findByIdAndUpdate(id, {
            starting_price,
            source_dest,
            dest,
            vehicle,
            travel_name,
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
exports.updateAboutUS = updateAboutUS;
const deleteAboutUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.deleteAboutUs = deleteAboutUs;
const addBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, desc } = req.body;
    try {
        let blogs_image = [];
        if (req.files) {
            const files = req.files;
            if (files["blogs_image"]) {
                blogs_image = files["blogs_image"].map((file) => file.path);
            }
        }
        let blogs = new Blogs_1.default({
            title,
            desc,
            blogs_image,
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
        let blogs_image = req.body.existingblogs_image || [];
        if (req.files) {
            const files = req.files;
            if (files["blogs_image"]) {
                const uploadedFiles = files["blogs_image"].map((file) => file.path);
                blogs_image.push(...uploadedFiles);
            }
        }
        const blogs = yield Blogs_1.default.findByIdAndUpdate(id, {
            title,
            desc,
            blogs_image,
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
    try {
        let dest_image = [];
        if (req.files) {
            const files = req.files;
            if (files["dest_image"]) {
                dest_image = files["dest_image"].map((file) => file.path);
            }
        }
        let dest = new Destination_1.default({
            title,
            dest_image,
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
        let dest_image = req.body.existingdest_image || [];
        if (req.files) {
            const files = req.files;
            if (files["dest_image"]) {
                const uploadedFiles = files["dest_image"].map((file) => file.path);
                dest_image.push(...uploadedFiles);
            }
        }
        const dest = yield Blogs_1.default.findByIdAndUpdate(id, {
            title,
            dest_image,
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
