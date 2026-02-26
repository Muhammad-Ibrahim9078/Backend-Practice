import express from "express";
import { createUser, fetchAllUser, welcometoDb, logInUser } from "../../Controllers/UserController/UserController.js";


const router = express.Router();


router.route("/").get(welcometoDb);


router.route("/create").post(createUser);




router.route("/login").post(logInUser);



router.route("/data").get(fetchAllUser);


export default router;