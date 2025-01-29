import Joi from "joi";
import { tryCatch } from "../utils/tryCatch.js";
import { teamValidationSchema } from "../validations/teamValidation.js";
import db from "../config/db.js";
import AppError from "../../auth-service/utils/AppError.js";

export const createTeam = tryCatch(async (req, res) => {
  const { name, description, team_img } =
    await teamValidationSchema.validateAsync(req.body);
  const checkIfExist = await db.query("SELECT * FROM team WHERE name LIKE $1", [
    name,
  ]);
  if (checkIfExist.rows.length > 0) {
    throw new AppError(
      "this name is already set to another team, please change it.",
      400
    );
  }
  const team = await db.query(
    "INSERT INTO team(name,description,team_img) VALUES($1,$2,$3) RETURNING *",
    [name, description, team_img]
  );
  await db.query("INSERT INTO user_roles VALUES($1,$2,$3)", [
    req.user.id,
    team.rows[0].id,
    "admin",
  ]);

  res.status(200).json({
    status: "succuss",
    data: "team created succuss",
  });
});

export const updateTeam = tryCatch(async (req, res) => {
  const teamId = req.params.id;
  const { name, description, team_img } =
    await teamValidationSchema.validateAsync(req.body);

  const role = await db.query(
    "SELECT * FROM user_roles WHERE user_id=$1 AND team_id= $2",
    [req.user.id, teamId]
  );

  if (role.rows.length === 0) {
    throw new AppError("Team not found or insufficient permissions", 400);
  }
  if (role.rows[0].role !== "admin") {
    throw new AppError("You don't have  permissions to update this team", 400);
  }

  // Find if team exists
  const foundQuery = "SELECT * FROM team WHERE id=$1";
  const foundTeam = await db.query(foundQuery, [teamId]);
  if (foundTeam.rows.length === 0) {
    throw new AppError("Team not found", 404); // Correct status code is 404 (not 204)
  }

  let updateQuery = "UPDATE team SET ";
  let queryParams = [];
  let setValues = [];

  // Add fields to the query dynamically if provided
  if (name) {
    setValues.push("name=$" + (setValues.length + 1));
    queryParams.push(name);
  }
  if (description) {
    setValues.push("description=$" + (setValues.length + 1));
    queryParams.push(description);
  }
  if (team_img) {
    setValues.push("team_img=$" + (setValues.length + 1));
    queryParams.push(team_img);
  }

  if (setValues.length === 0) {
    throw new AppError("No valid fields provided to update", 400);
  }

  // Construct the final query
  updateQuery += setValues.join(", ") + " WHERE id=$" + (setValues.length + 1);
  queryParams.push(teamId); // Add the team ID at the end of the parameters

  // Execute the update query
  const updatedTeam = await db.query(updateQuery, queryParams);

  // Return success response
  res.status(200).json({
    status: "success",
    data: "Team updated successfully",
  });
});

export const deleteTeam = tryCatch(async (req, res) => {
  const teamId = req.params.id;

  const role = await db.query(
    "SELECT * FROM user_roles WHERE user_id=$1 AND team_id=$2",
    [req.user.id, teamId]
  );

  if (role.rows.length === 0) {
    throw new AppError("Team not found or insufficient permissions", 400);
  }
  if (role.rows[0].role !== "admin") {
    throw new AppError("You don't have permissions to delete this team", 400);
  }

  const foundTeam = await db.query("SELECT * FROM team WHERE id=$1", [teamId]);
  if (foundTeam.rows.length === 0) {
    throw new AppError("Team not found", 404);
  }

  await db.query("DELETE FROM team WHERE id=$1", [teamId]);
  await db.query("DELETE FROM user_roles WHERE team_id=$1", [teamId]);

  res.status(200).json({
    status: "success",
    data: "Team deleted successfully",
  });
});

