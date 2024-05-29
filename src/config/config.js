import dotenv from "dotenv"

dotenv.config()

export const mailing = {
    service: process.env.MAIL_SERVICE,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_AUTH_USER, 
        pass: process.env.MAIL_AUTH_PASS
    }
}

export const mongoConnectionLink = process.env.MONGO_CONNECTION_LINK
export const sessionSecret = process.env.SESSION_SECRET
export const port = process.env.PORT
export const githubClientId = process.env.GITHUB_CLIENT_ID
export const githubClientSecret = process.env.GITHUB_CLIENT_SECRET
export const jwtSecret = process.env.JWT_SECRET