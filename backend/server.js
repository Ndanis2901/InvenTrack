import express from "express";
import dotenv from "dotenv";
import {db} from "./db/db.js";

dotenv.config();

//console.log(process.env.MONGO_URI);
const app = express();
import userRoutes from "./routes/userRoutes.js";
db();

app.use(express.json());

app.use("/api/users", userRoutes);

app.get('/', (req, res) => {
    res.send(`<h1>welcomef to node</h1>`);
});

//console.log(5 + 6, "", 6*6);

app.listen(5050, console.log('app is running on 5050'));