

const express = require("express")
const db = require("../models"); 
const bcrypt = require("bcrypt")
const session =require("express-session")
const usersController = require("../controllers/usersConrollers");
const { ensureAuth ,ensureAdmin } = require("../middlewares/auth");
const userRouter =  express.Router();







userRouter.get("/allUsers",usersController.getAllUsers)


userRouter.get("/user/:id",usersController.getUserById)
  

userRouter.delete("/user/:id",usersController.deleteUser)


userRouter.post("/register", usersController.addNewUser);


userRouter.post("/login",usersController.logInUser)

userRouter.post("/logout", usersController.logOutUser);
userRouter.patch("/users/:id/role",ensureAuth,ensureAdmin,usersController.updateUserRole)
module.exports = userRouter