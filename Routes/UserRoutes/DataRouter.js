import express from "express";
import dataSave from "../../Controllers/UserController/DataController.js";
import { getAllData } from "../../Controllers/UserController/getAllData.js";


const datarouter = express.Router();



datarouter.route("/data").post(dataSave);
datarouter.route("/all").get(getAllData);



export default datarouter;