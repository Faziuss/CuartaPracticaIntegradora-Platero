import Router from "express";
import UsersController from "../controllers/user.controller";
const usersRouter = Router();

usersRouter.get("/premium/:uid", UsersController.changeRole);

export default usersRouter;
