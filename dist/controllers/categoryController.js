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
exports.deleteVehicleCategory = exports.addVehicleSubCategory = exports.updateVehicleCategory = exports.getVehicleCategoryDetails = exports.getVehicleCategory = exports.addVehicleCategory = exports.deleteTourCategory = exports.addTourSubCategory = exports.updateTourCategory = exports.getTourCategoryDetails = exports.getTourCategory = exports.addTourCategory = exports.deleteTrekCategory = exports.addTrekSubCategory = exports.updateTrekCategory = exports.getTrekCategoryDetails = exports.getTrekCategory = exports.addTrekCategory = exports.deleteSubCategory = exports.addSubCategory = exports.deleteBusinessCategory = exports.updateBusinessCategory = exports.getBusinessCategoryDetails = exports.getBusinessCategory = exports.addBusinessCategory = void 0;
const businessCategory_1 = __importDefault(require("../models/Category/businessCategory"));
const subCategory_1 = __importDefault(require("../models/subCategory"));
const tourCategory_1 = __importDefault(require("../models/Category/tourCategory"));
const tourCategory_2 = __importDefault(require("../models/Category/tourCategory"));
const vehicleCategory_1 = __importDefault(require("../models/Category/vehicleCategory"));
const { customAlphabet } = require("nanoid");
const addBusinessCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { categoryName, desc, subCategory } = req.body;
    categoryName = categoryName.toLowerCase().trim();
    const customId = customAlphabet("1234567890", 4);
    let categoryId = customId();
    categoryId = "BC" + categoryId;
    try {
        let category = new businessCategory_1.default({
            categoryName,
            desc,
            subCategory,
            categoryId: categoryId,
        });
        businessCategory_1.default.findOne({ categoryName }).then((data) => __awaiter(void 0, void 0, void 0, function* () {
            if (data) {
                return res.status(400).json({ error: "Category already Exist" });
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
exports.addBusinessCategory = addBusinessCategory;
const getBusinessCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let category = yield businessCategory_1.default.find();
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
exports.getBusinessCategory = getBusinessCategory;
const getBusinessCategoryDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        let categoryDetails = yield businessCategory_1.default.findOne({ categoryId: id });
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
exports.getBusinessCategoryDetails = getBusinessCategoryDetails;
const updateBusinessCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let { categoryName, desc, subCategory } = req.body;
    categoryName = categoryName.toLowerCase().trim();
    try {
        const updatedData = {
            categoryName,
            desc,
            subCategory,
        };
        if (subCategory !== undefined) {
            if (Array.isArray(subCategory) && subCategory.length === 0) {
                updatedData.subCategory = [];
            }
            else {
                updatedData.subCategory = subCategory;
            }
        }
        else {
            updatedData.subCategory = [];
        }
        const category = yield businessCategory_1.default.findOneAndUpdate({ categoryId: id }, updatedData, { new: true });
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
exports.updateBusinessCategory = updateBusinessCategory;
const deleteBusinessCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        businessCategory_1.default.findByIdAndDelete(id).then((data) => {
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
exports.deleteBusinessCategory = deleteBusinessCategory;
const addSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let { subCategory } = req.body;
    if (!Array.isArray(subCategory)) {
        return res.status(400).json({ error: "Data must be an array format" });
    }
    try {
        const newSubCategory = subCategory.map((item) => item.toLowerCase().trim());
        const data = yield businessCategory_1.default.findOneAndUpdate({ categoryId: id }, { $push: { subCategory: { $each: newSubCategory } } }, { new: true });
        if (data) {
            return res.status(200).json({ message: "Sub Category Added" });
        }
        else {
            return res.status(404).json({ error: "Failed TO add" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.addSubCategory = addSubCategory;
// export const getSubCategory = async (req: Request, res: Response) => {
//   const subCategory = await SubCategory.find().populate("categoryName");
//   if (!subCategory) {
//     return res.status(404).json({ error: "Failed to fetch Sub category" });
//   } else {
//     return res.send(subCategory);
//   }
// };
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
// export const subcategoryDetails = async (req: Request, res: Response) => {
//   const id = req.params.id;
//   try {
//     await SubCategory.findById(id).then((data) => {
//       if (!data) {
//         return res.status(404).json({ error: "Detailed not found" });
//       } else {
//         return res.send(data);
//       }
//     });
//   } catch (error: any) {
//     return res.status(500).json({ error: error });
//   }
// };
// export const updateSubcategory = async (req: Request, res: Response) => {
//   const id = req.params.id;
//   let { categoryName, subCategoryName, desc } = req.body;
//   categoryName = categoryName.toLowerCase().trim();
//   subCategoryName = subCategoryName.trim();
//   let categoryId;
//   try {
//     const data = await Category.findOne({ categoryName });
//     if (!data) {
//       return res
//         .status(400)
//         .json({ error: "Category not found,  add category First" });
//     } else {
//       categoryId = data._id;
//       const newdata = await SubCategory.findByIdAndUpdate(
//         id,
//         {
//           categoryName,
//           subCategoryName,
//           desc,
//           categoryId,
//         },
//         { new: true }
//       );
//       if (!newdata) {
//         return res.status(400).json({ error: "failed to update" });
//       } else {
//         return res.status(200).json({ message: "Successfully Updated" });
//       }
//     }
//   } catch (error: any) {
//     return res.status(500).json({ error: error });
//   }
// };
const addTrekCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { categoryName, desc, subCategory } = req.body;
    categoryName = categoryName.toLowerCase().trim();
    const customId = customAlphabet("1234567890", 4);
    let categoryId = customId();
    categoryId = "TrC" + categoryId;
    try {
        let category = new tourCategory_1.default({
            categoryName,
            desc,
            subCategory,
            categoryId: categoryId,
        });
        tourCategory_1.default.findOne({ categoryName }).then((data) => __awaiter(void 0, void 0, void 0, function* () {
            if (data) {
                return res.status(400).json({ error: "Category already Exist" });
            }
            else {
                category = yield category.save();
                if (!category) {
                    return res.status(409).json({ error: "Failed T0 Add" });
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
exports.addTrekCategory = addTrekCategory;
const getTrekCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let category = yield tourCategory_1.default.find();
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
exports.getTrekCategory = getTrekCategory;
const getTrekCategoryDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        let categoryDetails = yield tourCategory_1.default.findOne({ categoryId: id });
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
exports.getTrekCategoryDetails = getTrekCategoryDetails;
const updateTrekCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let { categoryName, desc, subCategory } = req.body;
    categoryName = categoryName.toLowerCase().trim();
    try {
        const updatedData = {
            categoryName,
            desc,
            subCategory,
        };
        if (subCategory !== undefined) {
            if (Array.isArray(subCategory) && subCategory.length === 0) {
                updatedData.subCategory = [];
            }
            else {
                updatedData.subCategory = subCategory;
            }
        }
        else {
            updatedData.subCategory = [];
        }
        const category = yield tourCategory_1.default.findOneAndUpdate({ categoryId: id }, updatedData, { new: true });
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
exports.updateTrekCategory = updateTrekCategory;
const addTrekSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let { subCategory } = req.body;
    if (!Array.isArray(subCategory)) {
        return res.status(400).json({ error: "Data must be an array format" });
    }
    try {
        const newSubCategory = subCategory.map((item) => item.toLowerCase().trim());
        const data = yield tourCategory_1.default.findOneAndUpdate({ categoryId: id }, { $push: { subCategory: { $each: newSubCategory } } }, { new: true });
        if (data) {
            return res.status(200).json({ message: "Sub Category Added" });
        }
        else {
            return res.status(404).json({ error: "Failed TO add" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.addTrekSubCategory = addTrekSubCategory;
const deleteTrekCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        tourCategory_1.default.findByIdAndDelete(id).then((data) => {
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
exports.deleteTrekCategory = deleteTrekCategory;
const addTourCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { categoryName, desc, subCategory } = req.body;
    categoryName = categoryName.toLowerCase().trim();
    const customId = customAlphabet("1234567890", 4);
    let categoryId = customId();
    categoryId = "TuC" + categoryId;
    try {
        let category = new tourCategory_2.default({
            categoryName,
            desc,
            subCategory,
            categoryId: categoryId,
        });
        tourCategory_2.default.findOne({ categoryName }).then((data) => __awaiter(void 0, void 0, void 0, function* () {
            if (data) {
                return res.status(400).json({ error: "Category already Exist" });
            }
            else {
                category = yield category.save();
                if (!category) {
                    return res.status(409).json({ error: "Failed T0 Add" });
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
exports.addTourCategory = addTourCategory;
const getTourCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let category = yield tourCategory_2.default.find();
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
exports.getTourCategory = getTourCategory;
const getTourCategoryDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        let categoryDetails = yield tourCategory_2.default.findOne({ categoryId: id });
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
exports.getTourCategoryDetails = getTourCategoryDetails;
const updateTourCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let { categoryName, desc, subCategory } = req.body;
    categoryName = categoryName.toLowerCase().trim();
    try {
        const updatedData = {
            categoryName,
            desc,
            subCategory,
        };
        if (subCategory !== undefined) {
            if (Array.isArray(subCategory) && subCategory.length === 0) {
                updatedData.subCategory = [];
            }
            else {
                updatedData.subCategory = subCategory;
            }
        }
        else {
            updatedData.subCategory = [];
        }
        const category = yield tourCategory_2.default.findOneAndUpdate({ categoryId: id }, updatedData, { new: true });
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
exports.updateTourCategory = updateTourCategory;
const addTourSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let { subCategory } = req.body;
    if (!Array.isArray(subCategory)) {
        return res.status(400).json({ error: "Data must be an array format" });
    }
    try {
        const newSubCategory = subCategory.map((item) => item.toLowerCase().trim());
        const data = yield tourCategory_2.default.findOneAndUpdate({ categoryId: id }, { $push: { subCategory: { $each: newSubCategory } } }, { new: true });
        if (data) {
            return res.status(200).json({ message: "Sub Category Added" });
        }
        else {
            return res.status(404).json({ error: "Failed TO add" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.addTourSubCategory = addTourSubCategory;
const deleteTourCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        tourCategory_2.default.findByIdAndDelete(id).then((data) => {
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
exports.deleteTourCategory = deleteTourCategory;
const addVehicleCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { categoryName, desc, subCategory } = req.body;
    categoryName = categoryName.toLowerCase().trim();
    const customId = customAlphabet("1234567890", 4);
    let categoryId = customId();
    categoryId = "VC" + categoryId;
    try {
        let category = new vehicleCategory_1.default({
            categoryName,
            desc,
            subCategory,
            categoryId: categoryId,
        });
        vehicleCategory_1.default.findOne({ categoryName }).then((data) => __awaiter(void 0, void 0, void 0, function* () {
            if (data) {
                return res.status(400).json({ error: "Category already Exist" });
            }
            else {
                category = yield category.save();
                if (!category) {
                    return res.status(409).json({ error: "Failed T0 Add" });
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
exports.addVehicleCategory = addVehicleCategory;
const getVehicleCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let category = yield vehicleCategory_1.default.find();
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
exports.getVehicleCategory = getVehicleCategory;
const getVehicleCategoryDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        let categoryDetails = yield vehicleCategory_1.default.findOne({ categoryId: id });
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
exports.getVehicleCategoryDetails = getVehicleCategoryDetails;
const updateVehicleCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let { categoryName, desc, subCategory } = req.body;
    categoryName = categoryName.toLowerCase().trim();
    try {
        const updatedData = {
            categoryName,
            desc,
            subCategory,
        };
        if (subCategory !== undefined) {
            if (Array.isArray(subCategory) && subCategory.length === 0) {
                updatedData.subCategory = [];
            }
            else {
                updatedData.subCategory = subCategory;
            }
        }
        else {
            updatedData.subCategory = [];
        }
        const category = yield vehicleCategory_1.default.findOneAndUpdate({ categoryId: id }, updatedData, { new: true });
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
exports.updateVehicleCategory = updateVehicleCategory;
const addVehicleSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let { subCategory } = req.body;
    if (!Array.isArray(subCategory)) {
        return res.status(400).json({ error: "Data must be an array format" });
    }
    try {
        const newSubCategory = subCategory.map((item) => item.toLowerCase().trim());
        const data = yield vehicleCategory_1.default.findOneAndUpdate({ categoryId: id }, { $push: { subCategory: { $each: newSubCategory } } }, { new: true });
        if (data) {
            return res.status(200).json({ message: "Sub Category Added" });
        }
        else {
            return res.status(404).json({ error: "Failed TO add" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.addVehicleSubCategory = addVehicleSubCategory;
const deleteVehicleCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        vehicleCategory_1.default.findByIdAndDelete(id).then((data) => {
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
exports.deleteVehicleCategory = deleteVehicleCategory;
