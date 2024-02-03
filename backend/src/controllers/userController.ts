import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { BadRequestError } from "../middleware/errorMiddleware";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

const getUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  // const user = await User.findById(userId, "name email");
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true }, // Specify the fields to retrieve
  });

  if (!user) {
    throw new BadRequestError("User not available");
  }

  res.status(200).json(user);
});

export { getUser };
