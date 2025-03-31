"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./db/database");
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const categoryRoute_1 = __importDefault(require("./routes/CategoryRoute/categoryRoute"));
const businessRoute_1 = __importDefault(require("./routes/BusinessRoute/businessRoute"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const propertyRoute_1 = __importDefault(require("./routes/propertyRoute"));
const LandingPageRoute_1 = __importDefault(require("./routes/Pages/LandingPageRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const reservationRoute_1 = __importDefault(require("./routes/reservationRoute"));
const UserRoute_1 = __importDefault(require("./routes/UserRoutes/UserRoute"));
const DriverRoute_1 = __importDefault(require("./routes/BusinessRoute/DriverRoute"));
const Login_1 = __importDefault(require("./routes/Login/Login"));
const LocationRoute_1 = __importDefault(require("./routes/LocationRoute/LocationRoute"));
const businessManagerRoute_1 = __importDefault(require("./routes/BusinessRoute/businessManagerRoute"));
const businessSales_1 = __importDefault(require("./routes/BusinessRoute/businessSales"));
// import fileUpload from "express-fileupload";
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, cors_1.default)());
// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use(cors());
exports.app.use("/public/uploads", express_1.default.static("public/uploads"));
exports.app.use("/api", UserRoute_1.default);
exports.app.use("/api", LandingPageRoute_1.default);
exports.app.use("/api", adminRoute_1.default);
exports.app.use("/api", categoryRoute_1.default);
exports.app.use("/api", businessRoute_1.default);
exports.app.use("/api", productRoute_1.default);
exports.app.use("/api", propertyRoute_1.default);
exports.app.use("/api", reservationRoute_1.default);
exports.app.use("/api", DriverRoute_1.default);
exports.app.use("/api", Login_1.default);
exports.app.use("/api", LocationRoute_1.default);
exports.app.use("/api", businessManagerRoute_1.default);
exports.app.use("/api", businessSales_1.default);
const port = 3000;
exports.app.listen(port, () => {
    console.log(`Server Started on ${port}`);
});
