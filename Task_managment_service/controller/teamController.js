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
    "INSERT INTO team(name,description,team_img) VALUES($1,$2,$3)",
    [name, description, team_img]
  );
  res.status(200).json({
    status: "succuss",
    data: "team created succuss",
  });
});

export const updateTeam = tryCatch(async (req, res) => {
  const teamId = req.params.id;
  const { name, description, team_img } =
    await teamValidationSchema.validateAsync(req.body);

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

