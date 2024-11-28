"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, json, colorize } = winston_1.format;
const consoleLogFormat = winston_1.format.combine(winston_1.format.colorize(), winston_1.format.printf(({ level, message, timestamp }) => {
    return `${level}: ${message}`;
}));
const logger = (0, winston_1.createLogger)({
    level: "info",
    format: combine(colorize(), timestamp(), json()),
    transports: [
        new winston_1.transports.Console({
            format: consoleLogFormat,
        }),
        new winston_1.transports.File({ filename: "appLogger.log" }),
    ],
});
exports.default = logger;
