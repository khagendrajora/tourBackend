"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, json, colorize } = winston_1.format;
require("winston-mongodb");
const consoleLogFormat = winston_1.format.combine(winston_1.format.colorize(), winston_1.format.printf(({ level, message, timestamp }) => {
    return `${level}: ${message} :${timestamp}`;
}));
const logger = (0, winston_1.createLogger)({
    level: "info",
    format: combine(colorize(), timestamp(), json()),
    transports: [
        new winston_1.transports.Console({
            format: consoleLogFormat,
        }),
        new winston_1.transports.File({ filename: "app.log" }),
        new winston_1.transports.MongoDB({
            db: process.env.DATABASE || "",
            collection: "AppLogs",
            level: "info",
        }),
    ],
});
exports.default = logger;
