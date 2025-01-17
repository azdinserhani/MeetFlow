import jwt from "jsonwebtoken";
import AppError from "../../auth-service/utils/AppError.js";
import { tryCatch } from "../utils/tryCatch.js";
import db from "../config/db.js";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
     console.log(token);
    if (!token) {
      throw new AppError("Please login to get access", 401);
    }
   
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          throw new AppError("Token expired", 401);
        }
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
  verifyToken(req, res, () => {
    if (req.user.id != req.params.id) {
      throw new AppError("You are not authorized", 401);
    }
    next();
  });
};

export const verifyAdmin = tryCatch((req, res, next) => {
  verifyToken(req, res, async () => {
    const userId = req.user.id;
    const userRole = await db.query(
      "SELECT * FROM user_roles WHERE id = $1",
      [userId]
    );
   

    if (userRole.rows[0].role !== "admin") {
      throw new AppError("You are not authorized", 401);
    }
    next();
  });
});
