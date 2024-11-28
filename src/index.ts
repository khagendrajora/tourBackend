import express, { Express } from "express";
import dotenv from "dotenv";
import logger from "./logger";
import morgan from "morgan";
import useragent from "express-useragent";
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
import UserRoute from "./routes/ClientRoutes/UserRoute";
import DriverRoute from "./routes/driverRoutes/DriverRoute";
import Login from "./routes/Login/Login";

export const app: Express = express();
app.use(express.json());

app.use(cookieParser());
app.use(cors());
app.use(useragent.express());

const morganFormat = ":method :url :status :response-time ms :ip :device";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: any) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.use("/public/uploads", express.static("public/uploads"));
app.use("/api", UserRoute);
app.use("/api", LandingPageRoute);
app.use("/api", userRoute);
app.use("/api", categoryRoute);
app.use("/api", businessRoute);
app.use("/api", productRoute);
app.use("/api", propertyRoute);
app.use("/api", reservationRoute);
app.use("/api", DriverRoute);
app.use("/api", Login);

const port = 3000;

app.listen(port, () => {
  console.log(`Server Started on ${port}`);
});
