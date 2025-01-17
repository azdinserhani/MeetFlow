import express from "express";
import teamRoute from "./routes/teamRoute.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser())
app.use(express.json());
app.use("/", teamRoute);

app.use(errorHandler);
export default app;
