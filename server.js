import express from "express";
import { config } from "dotenv";
import connectedMongoDb from "./database/db.js";
import router from "./Routes/UserRoutes/UserRoute.js";
import cors from 'cors'
import datarouter from "./Routes/UserRoutes/DataRouter.js";


config({
  path: "./.env",
})

const port = process.env.PORT;
const app = express();

// app.use(cors());
app.use(express.json())
app.use(cors())

connectedMongoDb();


app.use("/user", router)
app.use("/data", datarouter)


app.listen(port, ()=>{
  console.log("Server is Running")
});