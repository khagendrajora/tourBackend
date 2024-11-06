import express from "express";
import { addNewUser } from "../../controllers/Client/userController";

export const router = express.Router();

router.post("/addUser", addNewUser);
