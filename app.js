import express from "express";
import cookierParser from "cookie-parser";
import cors from "cors";
// import nodeFetch from "node-fetch";








const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//common middleware

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookierParser());



import healthcheckroute from "./routes/healthcheck.js";
app.use("/healthcheck", healthcheckroute)


app.get("/test", (req,res) =>{
    res.send("hello")
})

import wproutes from "./routes/wallpaper.js"
app.use("/wallpaper", wproutes)

import catroutes from "./routes/category.js"
app.use("/categories", catroutes)

export { app };
