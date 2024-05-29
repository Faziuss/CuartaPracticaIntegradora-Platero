import Router from "express";
import UsersController from "../controllers/user.controller.js";
import { roleAdmin } from "../middlewares/roleAcess.js";
const usersRouter = Router();

usersRouter.get("/premium/:uid", roleAdmin, UsersController.changeRole);

export default usersRouter;
