import express from "express";
import dotenv from "dotenv";
import {db} from "./db/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5050;

import morgan from "morgan";
import helmet from "helmet";

db();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());

if(process.env.MODE_ENV !== "production") {
    app.use(morgan("dev"));
}

app.use("/api/users", userRoutes);

app.get('/', (req, res) => {
    res.send(`<h1>welcomef to node</h1>`);
});

//console.log(5 + 6, "", 6*6);

app.listen(5050, console.log(`app is running on ${port}`));