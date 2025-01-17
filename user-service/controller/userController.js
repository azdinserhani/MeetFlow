import { tryCatch } from "../utils/tryCatch.js";
import db from "../config/db.js";
import AppError from "../utils/AppError.js";
import { userValidationSchema } from "../validations/uservalidation.js";

//get user by id
export const getUserById = tryCatch(async (req, res) => {
  const { id } = req.params;
  const user = await db.query("SELECT * FROM user_acount WHERE id = $1", [id]);
  if (user.rows.length === 0) {
    throw new AppError("User not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: user.rows[0],
  });
});

//update user
export const updateUser = tryCatch(async (req, res) => {
  const userId = req.user.id;
  const { profileImg } = req.body;
  const { email, first_name, last_name } =
    await userValidationSchema.validateAsync(req.body);
  const query =
    "UPDATE user_acount SET email = $1, first_name = $2, last_name = $3, profile_img = $4,updated_at = $5 WHERE id = $6 RETURNING *";
  const user = await db.query(query, [
    email,
    first_name,
    last_name,
    profileImg,
    new Date(),
    userId,
  ]);
  res.status(200).json({
    status: "success",
    data: user.rows[0],
  });
});

//delete user
export const deleteUser = tryCatch(async (req, res) => {
  const userId = req.user.id;
  const query = "DELETE FROM user_acount WHERE id = $1";
  const user = await db.query(query, [userId]);
  if (user.rowCount === 0) {
    throw new AppError("User not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: "User deleted successfully",
  });
});

//get all user
export const getAllUser = tryCatch(async (req, res) => {
  const queryTeamId =
    "SELECT team_id FROM user_roles WHERE user_id = $1 GROUP BY team_id";
  const teamId = await db.query(queryTeamId, [req.user.id]);

  const query = `SELECT *
                  FROM user_acount us
                  INNER JOIN user_roles ur
                  ON us.id = ur.user_id 
                  WHERE ur.team_id = $1`;
  const users = await db.query(query, [teamId.rows[0].team_id]);
  res.status(200).json({
    status: "succuss",
    result: users.rowCount,
    data: users.rows,
  });
});
