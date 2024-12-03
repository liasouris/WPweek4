import express from "express";
import path from "path";
import mongoose, { Connection } from "mongoose";
import morgan from "morgan";
import router from "./src/routes/index";


const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "../data.json");

const mongoDB: string = "mongodb://127.0.0.1:27017/testdb";
mongoose.connect(mongoDB)
mongoose.Promise = Promise;    
const db: Connection = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error"))

app.use(morgan("dev"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "../public")));
app.use("/", router);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
