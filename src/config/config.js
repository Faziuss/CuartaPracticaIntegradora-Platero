import dotenv from "dotenv"

dotenv.config()

export const mongoConnectionLink = process.env.MONGO_CONNECTION_LINK
export const sessionSecret = process.env.SESSION_SECRET
export const port = process.env.PORT
export const githubStrategy = process.env.GITHUB_STRATEGY