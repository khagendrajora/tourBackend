import express from "express";
import { veh_Rev } from "../controllers/Reservation/vehRevController";
import { getReservDates } from "../controllers/Reservation/resrvedDated";
import { reservationData, validation } from "../validation/Validation";

const router = express.Router();

router.post("/addRev/:id", reservationData, validation, veh_Rev);

router.get("/reservdates/:id", getReservDates);

export default router;
