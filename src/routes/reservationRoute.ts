import express from "express";
import { vehReservation } from "../controllers/Reservation/vehRevController";
import { getReservedDates } from "../controllers/Reservation/resrvedDated";
const router = express.Router();

router.post("/addRev/:id", vehReservation);

router.get("/reservdates/:id", getReservedDates);

export default router;
