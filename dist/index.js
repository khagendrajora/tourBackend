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
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const categoryRoute_1 = __importDefault(require("./routes/categoryRoute"));
const businessRoute_1 = __importDefault(require("./routes/businessRoute"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const propertyRoute_1 = __importDefault(require("./routes/propertyRoute"));
const LandingPageRoute_1 = __importDefault(require("./routes/Pages/LandingPageRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const reservationRoute_1 = __importDefault(require("./routes/reservationRoute"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, cors_1.default)({
    origin: "http://localhost:4000",
    credentials: true,
}));
exports.app.use("/api", LandingPageRoute_1.default);
exports.app.use("/api", userRoute_1.default);
exports.app.use("/api", categoryRoute_1.default);
exports.app.use("/api", businessRoute_1.default);
exports.app.use("/api", productRoute_1.default);
exports.app.use("/api", propertyRoute_1.default);
exports.app.use("/api", reservationRoute_1.default);
console.log("test");
exports.app.use("/public/uploads", express_1.default.static("public/uploads"));
const port = 3000;
exports.app.listen(port, () => {
    console.log(`Server Started on ${port}`);
});
