import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const veriftyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWTSECRET as string);
    req.body.data = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};
