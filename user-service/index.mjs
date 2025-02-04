import express from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.mjs";
import cokieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.mjs";
const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(cokieParser());
app.use("/", userRoute);
app.use(errorHandler);

export default app;