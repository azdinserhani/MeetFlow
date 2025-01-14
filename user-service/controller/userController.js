import { tryCatch } from "../utils/tryCatch.js";
import db from "../config/db.js";
import AppError from "../utils/AppError.js";


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