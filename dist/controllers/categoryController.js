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
exports.updateSubcategory = exports.subcategoryDetails = exports.deleteSubCategory = exports.getSubCategory = exports.addSubCategory = exports.deleteCategory = exports.updateCategory = exports.getCategoryDetails = exports.getCategory = exports.addCategory = void 0;
const category_1 = __importDefault(require("../models/category"));
const subCategory_1 = __importDefault(require("../models/subCategory"));
const { customAlphabet } = require("nanoid");
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { categoryName, desc, subCategory } = req.body;
    categoryName = categoryName.toLowerCase().trim();
    const customId = customAlphabet("1234567890", 4);
    let categoryId = customId();
    categoryId = "C" + categoryId;
    try {
        let category = new category_1.default({
            categoryName,
            desc,
            subCategory,
            categoryId: categoryId,
        });
        category_1.default.findOne({ categoryName }).then((data) => __awaiter(void 0, void 0, void 0, function* () {
            if (data) {
                return res.status(400).json({ error: "This category already Exist" });
            }
            else {
                category = yield category.save();
                if (!category) {
                    return res.status(409).json({ error: "fail to add category" });
                }
                else {
                    return res.send(category);
                }
            }
        }));
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.addCategory = addCategory;
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let category = yield category_1.default.find();
        if (category.length > 0) {
            return res.send(category);
        }
        else {
            return res.status(400).json({ error: "Not Found" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getCategory = getCategory;
const getCategoryDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        let categoryDetails = yield category_1.default.findById(id);
        if (!categoryDetails) {
            return res
                .status(404)
                .json({ error: "Failed to fetch category Details" });
        }
        else {
            return res.send(categoryDetails);
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getCategoryDetails = getCategoryDetails;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let { categoryName, desc, subCategory } = req.body;
    categoryName = categoryName.toLowerCase().trim();
    try {
        const category = yield category_1.default.findByIdAndUpdate(id, {
            categoryName,
            desc,
            subCategory,
        }, { new: true });
        if (!category) {
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
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        category_1.default.findByIdAndDelete(id).then((data) => {
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
exports.deleteCategory = deleteCategory;
const addSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { categoryName, subCategoryName, desc } = req.body;
    categoryName = categoryName.toLowerCase().trim();
    subCategoryName = subCategoryName.trim();
    let categoryId;
    try {
        const data = yield category_1.default.findOne({ categoryName });
        if (data) {
            categoryId = data._id;
        }
        else {
            return res
                .status(404)
                .json({ error: "Category not found,  add category First" });
        }
        let subCategory = new subCategory_1.default({
            categoryName,
            categoryId: categoryId,
            subCategoryName,
            desc,
        });
        subCategory = yield subCategory.save();
        if (!subCategory) {
            return res.status(409).json({ error: "fail to add subcategory" });
        }
        else {
            return res.send(subCategory);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.addSubCategory = addSubCategory;
const getSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subCategory = yield subCategory_1.default.find().populate("categoryName");
    if (!subCategory) {
        return res.status(404).json({ error: "Failed to fetch Sub category" });
    }
    else {
        return res.send(subCategory);
    }
});
exports.getSubCategory = getSubCategory;
const deleteSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        subCategory_1.default.findByIdAndDelete(id).then((data) => {
            if (!data) {
                return res.status(404).json({ error: "Failed to delete" });
            }
            else {
                return res.status(200).json({ message: "Successfully Deleted" });
            }
        });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.deleteSubCategory = deleteSubCategory;
const subcategoryDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        yield subCategory_1.default.findById(id).then((data) => {
            if (!data) {
                return res.status(404).json({ error: "Detailed not found" });
            }
            else {
                return res.send(data);
            }
        });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.subcategoryDetails = subcategoryDetails;
const updateSubcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let { categoryName, subCategoryName, desc } = req.body;
    categoryName = categoryName.toLowerCase().trim();
    subCategoryName = subCategoryName.trim();
    let categoryId;
    try {
        const data = yield category_1.default.findOne({ categoryName });
        if (!data) {
            return res
                .status(400)
                .json({ error: "Category not found,  add category First" });
        }
        else {
            categoryId = data._id;
            const newdata = yield subCategory_1.default.findByIdAndUpdate(id, {
                categoryName,
                subCategoryName,
                desc,
                categoryId,
            }, { new: true });
            if (!newdata) {
                return res.status(400).json({ error: "failed to update" });
            }
            else {
                return res.status(200).json({ message: "Successfully Updated" });
            }
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.updateSubcategory = updateSubcategory;
