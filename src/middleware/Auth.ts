import jwt from "jsonwebtoken";

export const veriftyToken = (req: any, res: any, next: any) => {
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
    const decoded = jwt.verify(token, jwtSecret as string);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Invalid Token or Expired ", message: "Login Again" });
  }
};
