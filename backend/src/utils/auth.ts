import jwt from "jsonwebtoken";
import { NextFunction, Response, Request } from "express";
import { BadRequestError } from "../middleware/errorMiddleware";

const generateToken = (res: Response, userId: string) => {
  const jwtSecret = process.env.ACCESS_TOKEN_SECRET || "";
  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: "1h",
    algorithm: "HS256",
  });
  return token;
};

const refreshToken = (res: Response, userId: string) => {
  const jwtSecret = process.env.REFRESH_TOKEN_SECRET || "";
  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: "1d",
    algorithm: "HS256",
  });
  return token;
};

const clearToken = (res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
};

const verifyToken = (req: Request, res: Response) => {
  try {
    if (!req.headers["authorization"]) {
      return res.status(401).json({ message: "You are not authenticated" });
    }
    const token = req.headers["authorization"].split(" ")[1];
    const jwtSecret = process.env.ACCESS_TOKEN_SECRET || "";
    const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload;
    if (!decoded || !decoded.userId) {
      throw new BadRequestError("UserId not found");
    }
    return decoded;
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { generateToken, clearToken, refreshToken, verifyToken };
