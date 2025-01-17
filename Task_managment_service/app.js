import express from "express";
import teamRoute from "./routes/teamRoute.js";
import errorHandler from "./middleware/errorHandler.js";
const app = express();
app.use(express.json());
app.use("/", teamRoute);

app.use(errorHandler);
export default app;
