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
      "this name is already set to another team, please change it."
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
