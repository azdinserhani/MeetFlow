import { tryCatch } from "../utils/tryCatch.js";
import db from "../config/db.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";
import { userValidationSchema } from "../validations/uservalidation.js";

import jwt from "jsonwebtoken";
//login function
export const login = tryCatch(async (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT u.id,u.email,au.password_hash
                  FROM user_acount AS u
                  INNER JOIN auth_providers AS au
                  ON u.id = au.user_id
                  WHERE u.email = $1;`;

  // Check if email and password exists
  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }
  // Check if user exists
  const user = await db.query(query, [email]);
  if (user.rows.length === 0) {
    throw new AppError("User does not exist", 401);
  }

  // Check if password is correct
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.rows[0].password_hash
  );
  if (!isPasswordCorrect) {
    throw new AppError("Invalid password", 401);
  }
  // Create token
  const token = jwt.sign(
    { id: user.rows[0].id, role: user.rows[0].role, email: user.rows[0].email },
    process.env.JWT_SECRET,
    {
      expiresIn: "90d",
    }
  );
  // Send token in cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({
    status: "success",
    message: "Logged in successfully",
  });
});

//register function
export const register = tryCatch(async (req, res) => {
  const { email, password, first_name, last_name } =
    await userValidationSchema.validateAsync(req.body);

  // Check if user exists
  const user = await db.query("SELECT * FROM user_acount WHERE email = $1", [
    email,
  ]);
  if (user.rows.length > 0) {
    throw new AppError("User already exists", 401);
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Save user to database
  const userId = await db.query(
    "INSERT INTO user_acount (email, first_name, last_name) VALUES ($1, $2, $3) RETURNING id",
    [email, first_name, last_name]
  );
  const authQuery = `INSERT INTO auth_providers (user_id, password_hash,provider) VALUES ($1, $2,'email')`;
  await db.query(authQuery, [userId.rows[0].id, hashedPassword]);
  res.status(201).json({
    status: "success",
    message: "User created successfully",
  });
});

//logout function
export const logout = tryCatch(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});
