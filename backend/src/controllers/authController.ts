import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { generateToken, clearToken, refreshToken } from "../utils/auth";
import {
  BadRequestError,
  AuthenticationError,
} from "../middleware/errorMiddleware";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        res.status(409).json({ message: "The email already exists" });
        return; // Exit the function
      }
      // encrypt password
      const saltRounds = 10; // Number of salt rounds for hashing
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      generateToken(res, newUser.id.toString());
      res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      });
    } catch (error) {
      throw new BadRequestError(error as string);
    }
  }
);

const authenticateUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AuthenticationError("User not found / password incorrect");
  }
  const access_token = generateToken(res, user.id.toString());
  const refresh_token = refreshToken(res, user.id.toString());
  res.status(200).json({
    access_token,
    refresh_token,
  });
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  clearToken(res);
  res.status(200).json({ message: "Successfully logged out" });
});

export { registerUser, authenticateUser, logoutUser };
