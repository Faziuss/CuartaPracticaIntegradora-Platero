import { AppError } from "../helpers/AppError.js";
import UserDTO from "../dao/DTOs/userDTO.js";
import { usersService } from "../repositories/index.js";
import { createHash, isValidPassword } from "../utils/utils.js";

class SessionsController {
  static async register(req, res) {
    res.status(201).send({ status: "sucess", message: "Usuario Registrado" });
  }

  static async registerFail(req, res) {
    throw new AppError(401, { message: "Authentication Error" });
  }

  static async login(req, res) {
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

  static async loginFail(req, res) {
    res.status(401).send({ status: "error", error: "login fail" });
  }

  static async githubCallback(req, res) {
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

  static async logOut(req, res) {
    req.session.destroy((err) => {
      if (err)
        throw new AppError(500, {
          message: "Hubo un error al intentar destruir la session",
        });
    });
    res.redirect("/login");
  }

  static async current(req, res) {
    const user = req.session.user;
    const userDTO = new UserDTO(user);
    res.send({ user: userDTO });
  }

  static async resetPassword(req, res) {
    try {
      res.send({ payload: true });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

}

export default SessionsController;
