import express from "express";
import { vehReservation } from "../controllers/Reservation/vehRevController";
import { getReservedDates } from "../controllers/Reservation/resrvedDated";
import { reservationData, validation } from "../validation/Validation";

const router = express.Router();

router.post("/addRev/:id", reservationData, validation, vehReservation);

router.get("/reservdates/:id", getReservedDates);

export default router;
