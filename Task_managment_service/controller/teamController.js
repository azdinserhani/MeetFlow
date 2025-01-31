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

export const getTeam = tryCatch(async (req, res) => {
  const teamId = req.params.id;
  console.log(teamId);

  const team = await db.query("SELECT * FROM team WHERE id=$1", [teamId]);
  if (team.rows.length === 0) {
    throw new AppError("Team not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: team.rows[0],
  });
});

export const getTeams = tryCatch(async (req, res) => {
  const teams = await db.query("SELECT * FROM team");
  res.status(200).json({
    status: "success",
    results: teams.rows.length,
    data: teams.rows,
  });
});

export const getTeamMembers = tryCatch(async (req, res) => {
  const teamId = req.params.id;
  const teamMembers = await db.query(
    "SELECT * FROM user_acount WHERE id IN (SELECT user_id FROM user_roles WHERE team_id=$1)",
    [teamId]
  );
  res.status(200).json({
    status: "success",
    results: teamMembers.rows.length,
    data: teamMembers.rows,
  });
});

export const addMemberToTeam = tryCatch(async (req, res) => {
  const teamId = req.params.id;
  const userId = req.body.userId;
  const userRole = req.body.role;

  const role = await db.query(
    "SELECT * FROM user_roles WHERE user_id=$1 AND team_id=$2",
    [req.user.id, teamId]
  );
  if (role.rows[0].role !== "admin") {
    throw new AppError(
      "You don't have permissions to add user to this team",
      400
    );
  }
  const checkIfExist = await db.query(
    "SELECT * FROM user_roles WHERE user_id=$1 AND team_id=$2",
    [userId, teamId]
  );
  if (checkIfExist.rows.length > 0) {
    throw new AppError("user already in this team", 400);
  }

  await db.query("INSERT INTO user_roles VALUES($1,$2,$3)", [
    userId,
    teamId,
    userRole,
  ]);

  res.status(200).json({
    status: "success",
    data: "user added to team successfully",
  });
});


export const removeMemberFromTeam = tryCatch(async (req, res) => { 
  const teamId = req.params.id;
  const userId = req.body.userId;

  const role = await db.query(
    "SELECT * FROM user_roles WHERE user_id=$1 AND team_id=$2",
    [req.user.id, teamId]
  );
  if (role.rows[0].role !== "admin") {
    throw new AppError(
      "You don't have permissions to remove user from this team",
      400
    );
  }

  const checkIfExist = await db.query(
    "SELECT * FROM user_roles WHERE user_id=$1 AND team_id=$2",
    [userId, teamId]
  );
  if (checkIfExist.rows.length === 0) {
    throw new AppError("user not in this team", 400);
  }

  await db.query("DELETE FROM user_roles WHERE user_id=$1 AND team_id=$2", [
    userId,
    teamId,
  ]);

  res.status(200).json({
    status: "success",
    data: "user removed from team successfully",
  });
});

export const getProjectsForTeam = tryCatch(async (req, res) => { 
  const teamId = req.params.id;
  const projects = await db.query("SELECT * FROM project WHERE team_id=$1", [
    teamId,
  ]);
  res.status(200).json({
    status: "success",
    results: projects.rows.length,
    data: projects.rows,
  });
});
// change user role in a team
export const changeUserRole = tryCatch(async (req, res) => { 
  const teamId = req.params.id;
  const userId = req.body.userId;
  const userRole = req.body.role;

  const role = await db.query(
    "SELECT * FROM user_roles WHERE user_id=$1 AND team_id=$2",
    [req.user.id, teamId]
  );
  if (role.rows[0].role !== "admin") {
    throw new AppError(
      "You don't have permissions to change user role in this team",
      400
    );
  }

  const checkIfExist = await db.query(
    "SELECT * FROM user_roles WHERE user_id=$1 AND team_id=$2",
    [userId, teamId]
  );
  if (checkIfExist.rows.length === 0) {
    throw new AppError("user not in this team", 400);
  }

  await db.query("UPDATE user_roles SET role=$1 WHERE user_id=$2 AND team_id=$3", [
    userRole,
    userId,
    teamId,
  ]);

  res.status(200).json({
    status: "success",
    data: "user role changed successfully",
  });
});