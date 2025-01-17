import Joi from "joi";
import { tryCatch } from "../utils/tryCatch";
import { teamValidationSchema } from "../validations/teamValidation";
import db from "../config/db.js";
import AppError from "../../auth-service/utils/AppError";
export const createTask = tryCatch(async (req, res) => {
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
  const team = await db.query("INSERT INTO team VALUES($1,$2,$3)", [
    name,
    description,
    team_img,
  ]);
});
