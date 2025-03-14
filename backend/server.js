import express from "express";
import dotenv from "dotenv";
import {db} from "./db/db.js";
import morgan from "morgan";
import helmet from "helmet";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, routeNotFound } from "./utils/errorHandler.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const port = process.env.PORT || 5050;


db();

app.get('/', (req, res) => {
    res.send(`<h1>welcomef to node</h1>`);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(cookieParser());

if(process.env.MODE_ENV !== "production") {
    app.use(morgan("dev"));
}

app.use("/api/users", userRoutes);

app.use('/*', routeNotFound);
app.use(errorHandler);

app.listen(port, console.log(`app is running on ${port}`));