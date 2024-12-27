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
exports.deleteHotDeals = exports.updateHotdeals = exports.getHotDealsById = exports.getHotDeals = exports.addHotDeals = void 0;
const HotDeals_1 = __importDefault(require("../../models/HotDeals/HotDeals"));
const addHotDeals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { price, sourceAddress, destAddress, vehicle } = req.body;
    try {
        let data = new HotDeals_1.default({
            price,
            sourceAddress,
            destAddress,
            vehicle,
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
        let data = yield HotDeals_1.default.find();
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
const getHotDealsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        let data = yield HotDeals_1.default.findById(id);
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
exports.getHotDealsById = getHotDealsById;
const updateHotdeals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let { price, sourceAddress, destAddress, vehicle } = req.body;
    try {
        const aboutUS = yield HotDeals_1.default.findByIdAndUpdate(id, {
            price,
            sourceAddress,
            destAddress,
            vehicle,
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
        HotDeals_1.default.findByIdAndDelete(id).then((data) => {
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
