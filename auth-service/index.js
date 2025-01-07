import express from "express";

import "dotenv/config";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import authRoute from "./routes/authRoute.js";
const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());


app.use("/api/v1/auth", authRoute);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
