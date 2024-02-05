import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { BadRequestError } from "../middleware/errorMiddleware";
import asyncHandler from "express-async-handler";
import { verifyToken } from "../utils/auth";

const prisma = new PrismaClient();

const getUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true }, // Specify the fields to retrieve
  });
  if (!user) {
    throw new BadRequestError("User not available");
  }
  res.status(200).json(user);
});

const getMe = asyncHandler(async (req: Request, res: Response) => {
  try {
    const decoded: any = verifyToken(req, res);
    if (!decoded || !decoded.userId) {
      throw new BadRequestError("UserId not found");
    }
    const userId = parseInt(decoded.userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true }, // Specify the fields to retrieve
    });
    if (!user) {
      throw new BadRequestError("User not available");
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export { getUser, getMe };
