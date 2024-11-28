"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./logger"));
const morgan_1 = __importDefault(require("morgan"));
const express_useragent_1 = __importDefault(require("express-useragent"));
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
const UserRoute_1 = __importDefault(require("./routes/ClientRoutes/UserRoute"));
const DriverRoute_1 = __importDefault(require("./routes/driverRoutes/DriverRoute"));
const Login_1 = __importDefault(require("./routes/Login/Login"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, cors_1.default)());
exports.app.use(express_useragent_1.default.express());
const morganFormat = ":method :url :status :response-time ms";
exports.app.use((0, morgan_1.default)(morganFormat, {
    stream: {
        write: (message) => {
            const logObject = {
                method: message.split(" ")[0],
                url: message.split(" ")[1],
                status: message.split(" ")[2],
                responseTime: message.split(" ")[3],
            };
            logger_1.default.info(JSON.stringify(logObject));
        },
    },
}));
exports.app.use("/public/uploads", express_1.default.static("public/uploads"));
exports.app.use("/api", UserRoute_1.default);
exports.app.use("/api", LandingPageRoute_1.default);
exports.app.use("/api", userRoute_1.default);
exports.app.use("/api", categoryRoute_1.default);
exports.app.use("/api", businessRoute_1.default);
exports.app.use("/api", productRoute_1.default);
exports.app.use("/api", propertyRoute_1.default);
exports.app.use("/api", reservationRoute_1.default);
exports.app.use("/api", DriverRoute_1.default);
exports.app.use("/api", Login_1.default);
const port = 3000;
exports.app.listen(port, () => {
    console.log(`Server Started on ${port}`);
});
