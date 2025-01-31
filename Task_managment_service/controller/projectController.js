import { tryCatch } from "../utils/tryCatch.js";
import db from "../config/db.js";
import { projectValidationSchema } from "../validations/teamValidation.js";
import AppError from "../utils/AppError.js";


export const createProject = tryCatch(async (req, res) => {
  const { team_id, name, description, status, start_date, end_date } =
        await projectValidationSchema.validateAsync(req.body);
    const checkIfExist = await db.query("SELECT * FROM project WHERE name LIKE $1", [name]);
    if (checkIfExist.rows.length > 0) {
      throw new AppError("project with this name already exist", 400);
    }
    const newProject = await db.query(
      "INSERT INTO project (team_id, name, description, status, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [team_id, name, description, status, start_date, end_date]
    );
    res.status(201).json({
      status: "success",
      data: newProject.rows[0],
    });
});

export const getAllProjects = tryCatch(async (req, res) => {
  const projects = await db.query("SELECT * FROM project");
  res.status(200).json({
    status: "success",
    data: projects.rows,
  });
});
