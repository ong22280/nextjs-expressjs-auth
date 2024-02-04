import { Request, Response } from "express";
// import User from "../models/User";
import { PrismaClient } from "@prisma/client";
import { generateToken, clearToken } from "../utils/auth";
import {
  BadRequestError,
  AuthenticationError,
} from "../middleware/errorMiddleware";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const registerUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  // const userExists = await User.findOne({ email });

  try {
    console.log("Creating user");

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
    console.log("newUser created");

    generateToken(res, newUser.id.toString());
    console.log("Token generated");

    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });
    console.log("Response sent");
  } catch (error) {
    throw new BadRequestError(error as string);
  }

  // const user = await User.create({
  //   name,
  //   email,
  //   password,
  // });

  // if (user) {
  //   generateToken(res, user._id);
  //   res.status(201).json({
  //     id: user._id,
  //     name: user.name,
  //     email: user.email,
  //   });
  // } else {
  //   throw new BadRequestError("An error occurred in registering the user");
  // }
});

const authenticateUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AuthenticationError("User not found / password incorrect");
  }

  generateToken(res, user.id.toString());

  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
  });

  // const user = await User.findOne({ email });

  // if (user && (await user.comparePassword(password))) {
  //   generateToken(res, user._id);
  //   res.status(201).json({
  //     id: user._id,
  //     name: user.name,
  //     email: user.email,
  //   });
  // } else {
  //   throw new AuthenticationError("User not found / password incorrect");
  // }
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  clearToken(res);
  res.status(200).json({ message: "Successfully logged out" });
});

export { registerUser, authenticateUser, logoutUser };
