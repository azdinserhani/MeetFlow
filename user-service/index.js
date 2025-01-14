import express from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import cokieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
const app = express();
const port = process.env.PORT ;
app.use(cors());
app.use(express.json());
app.use(cokieParser());
app.use("/api/v1/user", userRoute);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
