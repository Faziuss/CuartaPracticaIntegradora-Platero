import Router from "express";
import UsersController from "../controllers/user.controller.js";
import { roleAdmin } from "../middlewares/roleAcess.js";
import upload from "../middlewares/upload.middleware.js";
const usersRouter = Router();

usersRouter.get('/', UsersController.getAll)
usersRouter.get("/premium/:uid", roleAdmin, UsersController.changeRole);
usersRouter.post('/:uid/documents', upload.array('document') ,UsersController.uploadDocuments)
usersRouter.post('/:uid/profile-picture', upload.single('profile'), UsersController.uploadProfilePicture)
usersRouter.delete('/:uid', UsersController.deleteUser)
usersRouter.delete('/', roleAdmin, UsersController.deleteUnactive)

export default usersRouter;
