import express, { Router } from "express";
//const express = require("express");
//const member = require("./router/v1/member.js");
import * as member from "./router/v1/member.js";
const app = express();
const port = 3000;

const v1Router = express.Router();
const v2Router = express.Router();

const logger = (req, res, next) => {
  console.log("Request Body:");
  console.log(req.body);
  next();
};

app.get("/", (req, res) => {
  res.send("{'data':'welcom my site.'}");
});

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({ extended: true })
); /* bodyParser.urlencoded() is deprecated */

app.use(logger);

app.listen(port, () => {
  console.log(process.env);
  console.log(`domain:https://localhost:${port}`);
});

v1Router.post("/user/sign_in", member.signIn);

app.use("/api/v1", v1Router);
app.use("/api/v2", v2Router);
