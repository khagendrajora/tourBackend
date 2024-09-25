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
exports.veh_Rev = void 0;
const vehReserv_1 = __importDefault(require("../../models/Reservations/vehReserv"));
const vehicle_1 = __importDefault(require("../../models/Product/vehicle"));
const ReservedDated_1 = __importDefault(require("../../models/Reservations/ReservedDated"));
const veh_Rev = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { passenger_name, age, email, phone, sourceAdd, destAdd, bookingDate, address, } = req.body;
    try {
        const veh_data = yield vehicle_1.default.findOne({ _id: id });
        if (!veh_data) {
            return res.status(401).json({ error: "not found" });
        }
        let veh_rev = new vehReserv_1.default({
            veh_id: veh_data._id,
            veh_type: veh_data.veh_Category,
            services: veh_data.services,
            amenities: veh_data.amenities,
            veh_number: veh_data.veh_number,
            capacity: veh_data.capacity,
            veh_name: veh_data.name,
            passenger_name,
            age,
            sourceAdd,
            destAdd,
            email,
            phone,
            bookingDate,
            address,
        });
        veh_rev = yield veh_rev.save();
        if (!veh_rev) {
            return res.status(400).json({ error: "Booking failed" });
        }
        else {
            let resrvDate = new ReservedDated_1.default({
                veh_id: veh_data._id,
                bookingDate,
            });
            resrvDate = yield resrvDate.save();
            if (!resrvDate) {
                return res.status(400).json({ error: "failed to save date" });
            }
            else {
                return res.status(200).json({ message: "Booked" });
            }
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.veh_Rev = veh_Rev;
