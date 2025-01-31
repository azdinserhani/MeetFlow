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
};
export const verifyRole = (role) => {


  return tryCatch(async (req, res, next) => {
    const userRole = await db.query(
      "SELECT * FROM user_roles WHERE user_id=$1 AND team_id=$2",
      [req.user.id, req.params.id]
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

export const verifyTaskRole = () => {
  return tryCatch(async (req, res, next) => {
    const check = await db.query(
      `SELECT p.id,u.*
                                    FROM user_roles u
                                    INNER JOIN project p
                                    on u.team_id = p.team_id
                                    where u.role LIKE 'admin'
                                    AND p.id = $1`,
      [req.body.project_id]
    );
    console.log(check.rows);
    
    if (check.rows.length === 0) {
      return next(
        new AppError(
          "You are not authorized to create task in this project",
          401
        )
      );
    }

    next();
  });
};
