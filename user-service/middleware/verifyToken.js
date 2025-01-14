import jwt from "jsonwebtoken";
import AppError from "../../auth-service/utils/AppError.js";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new AppError("Please login to get access", 401);
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        throw new AppError("Invalid token", 401);
      }
      req.user = user;
    });
    next();
  } catch (error) {
    next(error);
  }
};
export const verifyAuth = (req, res, next) => {
  if (!req.user) {
    throw new AppError("You are not authorized to access this route", 401);
  }
  next();
};
