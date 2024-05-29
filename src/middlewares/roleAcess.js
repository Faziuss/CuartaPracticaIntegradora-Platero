import { AppError } from "../helpers/AppError.js";

export const checkRole = (roles) => (req, res, next) => {
  const user = req.session.user;

  if (!Array.isArray(roles)) {
    roles = [roles];
  }

  if (!roles.includes(user.roles)) {
    return res.status(403).send({
      status: "error",
      error: `No estas autorizado para realizar esta acción, no eres un ${roles}`,
    });
  }

  next();
};

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
