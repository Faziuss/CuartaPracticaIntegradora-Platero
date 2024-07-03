import { usersService } from "../repositories/index.js";
import UserDTO from "../dao/DTOs/userDTO.js";

class UsersController {
  static async getAll(req, res) {
    try {
      const users = await usersService.getAll();
      const userDTOs = users.map((user) => new UserDTO(user));
      res.send({ status: "success", payload: userDTOs });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  static async changeRole(req, res) {
    const uid = req.params.uid;

    try {
      const user = await usersService.getById(uid);

      if (!["Usuario", "Premium"].includes(user.roles)) {
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

  static async uploadDocuments(req, res) {
    try {
      const { uid } = req.params;
      const result = await usersService.addDocuments(uid, req.files);
      res.send({ status: "success", payload: result });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  static async uploadProfilePicture(req, res) {
    try {
      const { uid } = req.params;
      const result = await usersService.addProfilePicture(uid, req.file);

      res.send({ status: "success", payload: result });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  static async deleteUser(req, res) {
    const uid = req.params.uid;

    try {
      const payload = await usersService.delete(uid);
      res.send({ status: "success", payload: payload });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }
  
  static async deleteUnactive(req, res){
    try {
        const deletedCount = await usersService.deleteUnactive()

        res.send({status:'success', payload: {deletedCount}})
    } catch (error) {
        res.status(500).send({status:'error', error: error.message})
    }
}
}

export default UsersController;
