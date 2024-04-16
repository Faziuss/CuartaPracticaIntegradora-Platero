import dotenv from "dotenv"

dotenv.config()

export const mongoConnectionLink = process.env.MONGO_CONNECTION_LINK
export const sessionSecret = process.env.SESSION_SECRET
export const port = process.env.PORT
export const githubClientId = process.env.GITHUB_CLIENT_ID
export const githubClientSecret = process.env.GITHUB_CLIENT_SECRET