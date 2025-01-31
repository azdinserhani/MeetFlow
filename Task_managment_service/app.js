import express from "express";
import teamRoute from "./routes/teamRoute.js";
import projectRoute from "./routes/projectRoute.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser())
app.use(express.json());
app.use("/team", teamRoute);
app.use("/project", projectRoute);

app.use(errorHandler);
export default app;
