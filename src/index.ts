import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import "./db/database";
import adminRoute from "./routes/adminRoute";
import categoryRoute from "./routes/CategoryRoute/categoryRoute";
import businessRoute from "./routes/BusinessRoute/businessRoute";
import productRoute from "./routes/productRoute";
import propertyRoute from "./routes/propertyRoute";
import LandingPageRoute from "./routes/Pages/LandingPageRoute";
import cookieParser from "cookie-parser";
import cors from "cors";
import reservationRoute from "./routes/reservationRoute";
import UserRoute from "./routes/UserRoutes/UserRoute";
import DriverRoute from "./routes/BusinessRoute/DriverRoute";
import Login from "./routes/Login/Login";
import LocationRoute from "./routes/LocationRoute/LocationRoute";
import businessManagerRoute from "./routes/BusinessRoute/businessManagerRoute";
import businessSales from "./routes/BusinessRoute/businessSales";

// import fileUpload from "express-fileupload";

export const app: Express = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/public/uploads", express.static("public/uploads"));
app.use("/api", UserRoute);
app.use("/api", LandingPageRoute);
app.use("/api", adminRoute);
app.use("/api", categoryRoute);
app.use("/api", businessRoute);
app.use("/api", productRoute);
app.use("/api", propertyRoute);
app.use("/api", reservationRoute);
app.use("/api", DriverRoute);
app.use("/api", Login);
app.use("/api", LocationRoute);
app.use("/api", businessManagerRoute);
app.use("/api", businessSales);

const port = 4000;

app.get("/", (req, res) => {
  res.send("HEllo Worlds");
});

app.listen(port, () => {
  console.log(`Server Start on ${port}`);
});
