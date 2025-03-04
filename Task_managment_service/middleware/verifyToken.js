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

export const verifyTaskRole = (roles) => {
  return tryCatch(async (req, res, next) => {
    const teamId = await db.query(
      `SELECT *
          FROM team t
          INNER JOIN project p
          ON p.team_id = t.id
          where p.id = $1`,
      [req.params.project_id]
    );
    console.log(teamId.rows);

    if (teamId.rows.length === 0) {
      return next(new AppError("Project not found", 404));
    }
    const userRole = await db.query(
      `SELECT *
      FROM user_roles u 
      where u.team_id =$1
      AND u.user_id = $2`,
      [teamId.rows[0].team_id, req.user.id]
    );
    console.log(userRole.rows);

    if (userRole.rows.length === 0) {
      return next(
        new AppError("You don't have permissions to handle this task", 400)
      );
    }
    if (!roles.includes(userRole.rows[0].role)) {
      return next(
        new AppError("You don't have permissions to handle this task", 400)
      );
    }
    const assignUserTask = await db.query(
      `SELECT *
      FROM task_assign t
      where t.task_id =$1
      AND t.user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (assignUserTask.rows.length === 0) {
      return next(
        new AppError("You don't have permissions to handle this task", 400)
      );
    }
    next();
  });
};
export const checkUserRole = tryCatch(async (req, res, next) => {
  const checkRole = await db.query(
    "SELECT role FROM user_roles WHERE user_id = $1 AND team_id = $2",
    [req.user.id, req.params.team_id]
  );
  if (checkRole.rows[0].role === "participant") {
    return next(new AppError("You are not an admin of this team", 400));
  }
  next();
});

export const checkTeamMember = tryCatch(async (req, res, next) => {
  const teamMember = await db.query(
    "SELECT user_id FROM user_roles WHERE team_id = $1",
    [req.params.team_id]
  );
  if (!teamMember.rows.find((member) => member.user_id === req.body.user_id)) {
    return next(new AppError("User is not a member of this team", 400));
  }
  next();
});

export const checkTaskAssignment = tryCatch(async (req, res, next) => {
  const checkIfTaskAlreadyAssigned = await db.query(
    "SELECT * FROM task_assign WHERE task_id = $1 AND user_id = $2",
    [req.params.id, req.body.user_id]
  );
  if (checkIfTaskAlreadyAssigned.rows.length > 0) {
    return next(new AppError("Task already assigned to this user", 400));
  }
  next();
});

export const verifyAssignTask = [
  checkUserRole,
  checkTeamMember,
  checkTaskAssignment,
];


