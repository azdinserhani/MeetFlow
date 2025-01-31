import jwt from "jsonwebtoken";
import AppError from "../../auth-service/utils/AppError.js";
import { tryCatch } from "../utils/tryCatch.js";
import db from "../config/db.js";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
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
}
export const verifyRole = (role) => {
  console.log(role);

  return tryCatch(async (req, res, next) => {
    const userRole = await db.query(
      "SELECT * FROM user_roles WHERE user_id=$1",
      [req.user.id]
    );


    if (!userRole.rows.length || userRole.rows[0].role !== role) {
      throw new AppError(
        "You don't have permissions to create a project in this team",
        400
      );
    }


    next();
  });
};