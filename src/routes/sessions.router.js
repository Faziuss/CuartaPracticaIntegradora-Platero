import { Router } from "express";
import { AppError } from "../helpers/AppError.js";
import passport from "passport";

const sessionRouter = Router();

const privateAcess = (req, res, next) => {
  if (!req.session.user) {
    console.log("not logged in");
    return res.redirect("/login");
  }

  next();
};

sessionRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "api/sessions/registerFail",
  }),
  async (req, res) => {
    res.status(201).send({ status: "sucess", message: "Usuario Registrado" });
  }
);

sessionRouter.post("/registerFail", (req, res) => {
  throw new AppError(401, { message: "Authentication Error" });
});

sessionRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/loginFail",
  }),
  async (req, res) => {
    const user = req.user;

    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      roles: user.roles,
      cart: user.cart,
    };
    res.status(201).send({
      status: "sucess",
      payload: req.session.user,
      message: "Logeado Correctamente",
    });
  }
);

sessionRouter.get("/loginFail", (req, res) => {
  res.status(401).send({ status: "error", error: "login fail" });
});

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    const user = req.user;

    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      roles: user.roles,
      cart: user.cart,
    };
    res.redirect("/products");
  }
);

sessionRouter.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err)
      throw new AppError(500, {
        message: "Hubo un error al intentar destruir la session",
      });
  });
  res.redirect("/login");
});

sessionRouter.get("/current", privateAcess, async (req, res) => {
   res.send({user: req.session.user})
});

export default sessionRouter;
