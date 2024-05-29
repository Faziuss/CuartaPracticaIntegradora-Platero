import { usersService } from "../repositories/index.js";

class UsersController {
  static async changeRole(req, res) {
    const uid = req.params.uid;

    try {
      const user = await usersService.getById(uid);

      if (!["User", "Premium"].includes(user.roles)) {
        throw new Error("User has invalid role");
      }

      if (user.roles == "Usuario") {
        user.roles = "Premium";
      } else {
        user.roles = "Usuario";
      }

      await usersService.update(user._id.toString(), {
        $set: { roles: user.roles },
      });

      res.send({ status: "success" });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }
}

export default UsersController;
