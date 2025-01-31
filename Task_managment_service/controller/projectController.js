import { tryCatch } from "../utils/tryCatch.js";
import db from "../config/db.js";
import { projectValidationSchema } from "../validations/teamValidation.js";
import AppError from "../utils/AppError.js";


export const createProject = tryCatch(async (req, res) => {
  const team_id = req.params.id;
  const {  name, description, status, start_date, end_date } =
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
  const userRole = await db.query(
    "SELECT * FROM user_roles WHERE user_id=$1 AND role='organizer'",
    [req.user.id]
  );
  if (!userRole.rows.length) {
    throw new AppError("You don't have permissions to view projects", 400);
  }
  const projects = await db.query("SELECT * FROM project WHERE team_id=$1", [userRole.rows[0].team_id]);

  res.status(200).json({
    status: "success",
    result: projects.rows.length,
    data: projects.rows,
  });
});

export const getProjectById = tryCatch(async (req, res) => {
  const id = req.params.id;
  const project = await db.query("SELECT * FROM project WHERE id=$1", [id]);
  if (project.rows.length === 0) {
    throw new AppError("project not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: project.rows[0],
  });
});

export const updateProject = tryCatch(async (req, res) => {
  const { id } = req.params;
  const { team_id, name, description, status, start_date, end_date } = await projectValidationSchema.validateAsync(req.body); ;

  //check if project is exist
  const project = await db.query("SELECT * FROM project WHERE id=$1", [id]);
  if (project.rows.length === 0) {
    throw new AppError("project not found", 404);
  }
  // check if user is an organizer of the team
  const userRole = await db.query(
    "SELECT * FROM user_roles WHERE user_id=$1 AND team_id=$2",
    [req.user.id, team_id]
  );
  console.log(userRole.rows[0]);
  
  if (!userRole.rows.length || userRole.rows[0].role !== "organizer") {
    throw new AppError(
      "You don't have permissions to update this project",
      400
    );
  }
  //update project
  const updatedProject = await db.query(
    "UPDATE project SET team_id=$1, name=$2, description=$3, status=$4, start_date=$5, end_date=$6 WHERE id=$7 RETURNING *",
    [team_id, name, description, status, start_date, end_date, id]
  );
  res.status(200).json({
    status: "success",
    data: updatedProject.rows[0],
  });

}); 

export const deleteProject = tryCatch(async (req, res) => {
  const { id } = req.params;
  const project = await db.query("SELECT * FROM project WHERE id=$1", [id]);
  if (project.rows.length === 0) {
    throw new AppError("project not found", 404);
  }
  const userRole = await db.query(
    "SELECT * FROM user_roles WHERE user_id=$1 AND team_id=$2",
    [req.user.id, project.rows[0].team_id]
  );
  if (!userRole.rows.length || userRole.rows[0].role !== "organizer") {
    throw new AppError(
      "You don't have permissions to delete this project",
      400
    );
  }
  await db.query("DELETE FROM project WHERE id=$1", [id]);
  res.status(200).json({
    status: "success",
    data: null,
  });
});
 
