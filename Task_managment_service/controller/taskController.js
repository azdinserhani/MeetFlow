import { tryCatch } from "../utils/tryCatch.js";
import AppError from "../utils/AppError.js";
import db from "../config/db.js";
import { taskValidationSchema } from "../validations/teamValidation.js";
export const createTask = tryCatch(async (req, res, next) => {
  const {
    project_id,
    title,
    description,
    status,
    priority,
    start_date,
    end_date,
    } = await taskValidationSchema.validateAsync(req.body);
    const check = await db.query(`SELECT p.id,u.*
                                    FROM user_roles u
                                    INNER JOIN project p
                                    on u.team_id = p.team_id
                                    where u.role LIKE 'admin'
                                    AND p.id = $1`, [project_id]);
    if(check.rows.length === 0){
      return next(new AppError("You are not authorized to create task in this project", 401));
    }
    const task = await db.query(
      `INSERT INTO task (project_id, title, description, status, priority, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [project_id, title, description, status, priority, start_date, end_date]
    );
    res.status(201).json({
      status: "success",
      data: task.rows[0],
    });
});

