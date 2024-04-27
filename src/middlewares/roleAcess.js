import { AppError } from "../helpers/AppError.js";

export const roleAdmin = (req,res, next) => {
    const user = req.sessions.user

    if(user.roles != "admin"){
        throw new AppError(403,{message: "No estas autorizado para realizar esta acción"})
    }

    next()
}

export const roleUser = (req,res,next) => {
    const user = req.sessions.user

    if(user.roles != "user"){
        throw new AppError(403,{message: "No estas autorizado para realizar esta acción"})
    }
}