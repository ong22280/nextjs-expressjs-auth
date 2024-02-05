import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { AuthenticationError } from "./errorMiddleware";

const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.headers["authorization"]) {
        throw new AuthenticationError("You are not authenticated");
      }
      const token = req.headers["authorization"].split(" ")[1];
      if (!token) {
        throw new AuthenticationError("Token not found");
      }
      const jwtSecret = process.env.ACCESS_TOKEN_SECRET || "";
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
      if (!decoded || !decoded.userId) {
        throw new AuthenticationError("UserId not found");
      }
      next();
    } catch (e) {
      throw new AuthenticationError("Invalid token");
    }
  }
);

export { authenticate };
