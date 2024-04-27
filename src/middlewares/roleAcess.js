import { AppError } from "../helpers/AppError.js";

export const roleAdmin = (req, res, next) => {
  const user = req.session.user;

  if (user.roles != "Admin") {
    throw new AppError(403, {
      message: "No estas autorizado para realizar esta acción",
    });
  }

  return next();
};

export const roleUser = (req, res, next) => {
  try {
    const user = req.session.user;

    if (user.roles != "Usuario") {
      throw new AppError(403, {
        message: "No estas autorizado para realizar esta acción",
      });
    }
    return next();
  } catch (error) {
    return next(error);
  }
};
