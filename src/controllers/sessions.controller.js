import { AppError } from "../helpers/AppError.js";
import UserDTO from "../dao/DTOs/userDTO.js";
import { usersService } from "../repositories/index.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import MailingService from "../services/mailing.service.js";
import { jwtSecret } from "../config/config.js";
import jwt from "jsonwebtoken";

const mailingService = new MailingService();

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

/*   static async verifyToken(req, res) {
    const { passwordResetToken } = req.params;

    try {
      jwt.verify(passwordResetToken, jwtSecret, (error) => {
        if (error) {
          return res.redirect("/reset-password");
        }
        res.redirect("/change-password");
      });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }
 */
  static async resetPassword(req, res) {
    try {
      const { email } = req.body;
      let user = await usersService.getByProperty("email", email);
      const payload = { id: user._id, email: user.email };
      const passwordResetToken = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
      await mailingService.sendPasswordResetMail(
        user,
        email,
        passwordResetToken
      );
      res.send({ payload: true });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  static async changePassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      console.log("token is", token);
      const decoded = jwt.verify(token, jwtSecret);
      console.log("password is", newPassword);
      let user = await usersService.getByProperty('_id', decoded.id);
      if (isValidPassword(user, newPassword)) {
        return res
          .status(400)
          .send({ status: "error", error: "same password" });
      }

      user.password = newPassword;

      await usersService.update(user._id.toString(), {
        $set: { password: createHash(user.password) },
      });

      res.send({ status: "success" });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        res.status(400).send({ status: 'error', error: 'Token expired' });
      } else {
        res.status(500).send({ status: 'error', error: error.message });
      }
    }
  }
}

export default SessionsController;
