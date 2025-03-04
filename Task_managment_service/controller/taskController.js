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
  const task = await db.query(
    `INSERT INTO task (project_id, title, description, status, priority, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [project_id, title, description, status, priority, start_date, end_date]
  );
  res.status(201).json({
    status: "success",
    data: task.rows[0],
  });
});

export const getTasks = tryCatch(async (req, res, next) => {
  const tasks = await db.query("SELECT * FROM task WHERE project_id=$1", [
    req.params.project_id,
  ]);
  res.status(200).json({
    status: "success",
    data: tasks.rows,
  });
});

export const deleteTask = tryCatch(async (req, res, next) => {
  const task = await db.query(
    "DELETE FROM task WHERE id=$1 AND project_id=$2",
    [req.params.id, req.params.project_id]
  );
  if (task.rowCount === 0) {
    return next(new AppError("Task not found", 404));
  }
  res.status(204).json({
    status: "success",
  });
});

export const updateTask = tryCatch(async (req, res, next) => {
  const {
    project_id,
    title,
    description,
    status,
    priority,
    start_date,
    end_date,
  } = req.body;

  const fields = [];
  const values = [];
  if (project_id !== undefined) {
    fields.push("project_id");
    values.push(project_id);
  }
  if (title !== undefined) {
    fields.push("title");
    values.push(title);
  }
  if (description !== undefined) {
    fields.push("description");
    values.push(description);
  }
  if (status !== undefined) {
    fields.push("status");
    values.push(status);
  }
  if (priority !== undefined) {
    fields.push("priority");
    values.push(priority);
  }
  if (start_date !== undefined) {
    fields.push("start_date");
    values.push(start_date);
  }
  if (end_date !== undefined) {
    fields.push("end_date");
    values.push(end_date);
  }

  if (fields.length === 0) {
    return next(new AppError("No fields to update", 400));
  }
  console.log(fields);
  console.log(values);

  const setClause = fields
    .map((field, index) => `${field}=$${index + 1}`)
    .join(", ");

  const task = await db.query(
    `UPDATE task SET ${setClause} WHERE id=$${
      fields.length + 1
    } AND project_id=$${fields.length + 2} RETURNING *`,
    [...values, req.params.id, req.params.project_id]
  );

  if (task.rows.length === 0) {
    return next(new AppError("Task not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: task.rows[0],
  });
});

export const assignTask = tryCatch(async (req, res, next) => {
  const { user_id } = req.body;
  const task = await db.query(
    `INSERT INTO task_assign (task_id, user_id) VALUES ($1, $2) RETURNING *`,
    [req.params.id, user_id]
  );
  res.status(201).json({
    status: "success",
    data: task.rows[0],
  });
});

export const unassignTask = tryCatch(async (req, res, next) => {
  const task = await db.query(
    "DELETE FROM task_assign WHERE task_id=$1 AND user_id=$2",
    [req.params.id, req.body.user_id]
  );
  if (task.rowCount === 0) {
    return next(new AppError("Task not found", 404));
  }
  res.status(204).json({
    status: "success",
  });
});

export const getAssignedTasks = tryCatch(async (req, res, next) => {
  const tasks = await db.query(
    `SELECT t.*
    FROM task t
    JOIN task_assign ta ON t.id = ta.task_id
    WHERE ta.user_id = $1`,
    [req.user.id]
  );
  res.status(200).json({
    status: "success",
    result: tasks.rows.length,
    data: tasks.rows,
  });
});
export const getAssignedTasksByUserId = tryCatch(async (req, res, next) => {
  const userRole = await db.query(
    `SELECT role
      FROM user_roles
      WHERE team_id = (SELECT team_id
      FROM user_roles
      WHERE user_id = $1)
      AND user_id = $2`,
    [req.params.user_id, req.user.id]
  );
  console.log(userRole.rows[0].role);
  if (userRole.rows[0].role !== "admin" || userRole.rows[0].role !== "organizer") {
    return next(
      new AppError(
        "You don't have permissions to get assign task for this user",
        400
      )
    );
  }
  const tasks = await db.query(
    `SELECT t.* 
    FROM task t 
    JOIN task_assign ta ON t.id = ta.task_id 
    WHERE ta.user_id = $1`,
    [req.params.user_id]
  );

  res.status(200).json({
    status: "success",
    result: tasks.rows.length,
    data: tasks.rows,
  });
});
