import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import "./db/database";
import userRoute from "./routes/userRoute";
import categoryRoute from "./routes/categoryRoute";
import businessRoute from "./routes/businessRoute";
import productRoute from "./routes/productRoute";
import propertyRoute from "./routes/propertyRoute";
import LandingPageRoute from "./routes/Pages/LandingPageRoute";
import cookieParser from "cookie-parser";
import cors from "cors";
import reservationRoute from "./routes/reservationRoute";

export const app: Express = express();
app.use(express.json());

app.use(cookieParser());
app.use(cors());

app.use("/api", LandingPageRoute);
app.use("/api", userRoute);
app.use("/api", categoryRoute);
app.use("/api", businessRoute);
app.use("/api", productRoute);
app.use("/api", propertyRoute);
app.use("/api", reservationRoute);

console.log("test");

app.use("/uploads", express.static("uploads"));
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server Started on ${port}`);
});
