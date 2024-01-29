import express from "express";

const app = express()
app.set("PORT", 8080);

app.use(express.json())
app.use(express.urlencoded({extended:true}))


export default app;