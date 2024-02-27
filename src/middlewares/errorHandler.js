import { AppError } from "../helpers/AppError.js";

export const errorHandler = (error, _req, res, _next) => {
  console.log(error);
  if (error instanceof AppError) {
    return res.status(error.statusCode).json(JSON.parse(error.message));
  }
  return res.status(500).json(error);
};
