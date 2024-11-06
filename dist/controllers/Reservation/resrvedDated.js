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
exports.getReservDates = exports.reservDates = void 0;
const ReservedDated_1 = __importDefault(require("../../models/Reservations/ReservedDated"));
const reservDates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehId, bookingDate } = req.body;
    try {
        let revDates = new ReservedDated_1.default({
            vehId,
            bookingDate,
        });
        revDates = yield revDates.save();
        if (!revDates) {
            return res.status(400).json({ error: "failed" });
        }
        else {
            return res.status(200).json({ message: "success" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.reservDates = reservDates;
const getReservDates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield ReservedDated_1.default.find({ veh_id: id });
        if (data) {
            return res.json(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getReservDates = getReservDates;
