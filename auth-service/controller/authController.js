import { tryCatch } from "../utils/tryCatch.js";
import db from "../config/db.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";
import { userValidationSchema } from "../validations/uservalidation.js";
import jwt from "jsonwebtoken";
//login function
export const login = tryCatch(async (req, res) => {
  const { email, password } = req.body;
  // Check if email and password exists
  if (!email || !password) {
    console.log("Please provide email and password");

    throw new AppError("Please provide email and password", 400);
  }
  // Check if user exists
  const user = await db.query("SELECT * FROM user_acount WHERE email = $1", [
    email,
  ]);
  if (user.rows.length === 0) {
    throw new AppError("User does not exist", 401);
  }
  
 
  // Check if password is correct
  bcrypt.compare(password, user.rows[0].password, (err, result) => {
    if (!result) {
      throw new AppError("Invalid password", 401);
    }
    console.log(process.env.JWT_SECRET);
    
    // Create token
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    // Send token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({
      status: "success",
      message: "Logged in successfully"
    });
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
  await db.query(
    "INSERT INTO user_acount (email, password, first_name, last_name, created_at) VALUES ($1, $2, $3, $4, NOW())",
    [email, hashedPassword, first_name, last_name]
  );
  res.status(201).json({
    status: "success",
    message: "User created successfully",
  });
});
