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
exports.deleteProperty = exports.propertyDetails = exports.getProperty = exports.updateProperty = exports.addProperty = void 0;
const property_1 = __importDefault(require("../models/property"));
const addProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { propName, propCategory, propSubCategory, email, website, phone, businessReg, tax, contactName, contactPhone, dateOfEstab, } = req.body;
    const { country, state, district, municipality, street, subrub, postcode } = req.body.address;
    try {
        const property = new property_1.default({
            propName,
            propCategory,
            propSubCategory,
            email,
            website,
            phone,
            businessReg,
            tax,
            contactName,
            contactPhone,
            dateOfEstab,
            address: {
                country,
                state,
                district,
                municipality,
                street,
                subrub,
                postcode,
            },
        });
        const savedData = yield property.save();
        if (!savedData) {
            return res.status(400).json({ error: "failed to save" });
        }
        else {
            return res.status(200).json({ message: "success" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.addProperty = addProperty;
const updateProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { propName, propCategory, propSubCategory, email, website, phone, businessReg, tax, contactName, contactPhone, dateOfEstab, } = req.body;
    const { country, state, district, municipality, street, subrub, postcode } = req.body.address;
    try {
        const data = yield property_1.default.findByIdAndUpdate(id, {
            propName,
            propCategory,
            propSubCategory,
            email,
            website,
            phone,
            businessReg,
            tax,
            contactName,
            contactPhone,
            dateOfEstab,
            address: {
                country,
                state,
                district,
                municipality,
                street,
                subrub,
                postcode,
            },
        }, { new: true });
        if (!data) {
            return res.status(400).json({
                error: "failed",
            });
        }
        else {
            return res.status(200).json({ message: "success" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateProperty = updateProperty;
const getProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let property = yield property_1.default.find();
        if (property.length === 0) {
            return res.send(property);
        }
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
});
exports.getProperty = getProperty;
const propertyDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield property_1.default.findById(id);
        if (!data) {
            return res.status(404).json({ error: "Failed to get Property" });
        }
        else {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.propertyDetails = propertyDetails;
const deleteProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        yield property_1.default.findByIdAndDelete(id).then((data) => {
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
exports.deleteProperty = deleteProperty;
