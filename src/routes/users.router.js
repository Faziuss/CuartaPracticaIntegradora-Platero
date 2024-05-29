import Router from "express";
import UsersController from "../controllers/user.controller.js";
const usersRouter = Router();

usersRouter.get("/premium/:uid", UsersController.changeRole);

export default usersRouter;
