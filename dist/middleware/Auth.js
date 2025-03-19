"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.veriftyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const veriftyToken = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token)
        return res.status(401).json({ message: "Access Denied" });
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWTSECRET);
        req.body.user = verified;
        next();
    }
    catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};
exports.veriftyToken = veriftyToken;
