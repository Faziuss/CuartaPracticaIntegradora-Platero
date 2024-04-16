import { Router } from "express";
import passport from "passport";
import SessionsController from "../controllers/sessions.controller.js";
import privateAcess from "../middlewares/privateAcess.js";

const sessionRouter = Router();

sessionRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "api/sessions/registerFail",
  }), SessionsController.register
);

sessionRouter.post("/registerFail", SessionsController.registerFail);

sessionRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/loginFail",
  }), SessionsController.login
);

sessionRouter.get("/loginFail", SessionsController.loginFail);

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }), SessionsController.githubCallback
);

sessionRouter.get("/logout", SessionsController.logOut);

sessionRouter.get("/current", privateAcess, SessionsController.current);

export default sessionRouter;
