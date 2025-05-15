"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.veriftyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const veriftyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
        // if (!token) return res.status(401).json({ error: "Access Denied" });
        return res.status(401).json({ error: "Access denied. No token provided." });
    const token = authHeader.split(" ")[1];
    try {
        const jwtSecret = process.env.JWTSECRET;
        if (!jwtSecret) {
            return res.status(500).json({ error: "Token not configured." });
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res
            .status(400)
            .json({ error: "Invalid Token or Expired ", message: "Login Again" });
    }
};
exports.veriftyToken = veriftyToken;
