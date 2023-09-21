import express, { Router } from "express";
//const express = require("express");
//const member = require("./router/v1/member.js");
import * as member from "./router/v1/member.js";
import * as hash from "./router/v1/hash_test.js";
import * as Auth from "./router/v1/auth.mjs";
import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const app = express();
const port = process.env.API_PORT;

const v1Router = express.Router();
const v2Router = express.Router();

const logger = (req, res, next) => {
  console.log("[REQUEST]");
  console.log("[QUERY]");
  console.log(req.query);
  console.log("[BODY]");
  console.log(req.body);
  next();
};
app.set("views", __dirname + "/pages");
app.set("view engine", "ejs");
// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({ extended: true })
); /* bodyParser.urlencoded() is deprecated */

//app.use(logger);

app.listen(port, () => {
  //console.log(process.env);
  console.log(`domain:http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.json({
    data: "welcome my site.",
  });
});

v1Router.post("/user/signIn", member.signIn);
v1Router.post("/user/signUp", member.signUp);
v1Router.get("/user/verifyEmailToken", member.verifyEmailToken);
v1Router.use(Auth.tokenParser);
v1Router.post("/user/sendVerifyEmailToken", member.createEmailVerifyToken);
v1Router.post("/user/modify", member.modify);
v1Router.get("/user/detail", member.detail);
v1Router.get("/hash/create", hash.create);
v1Router.get("/hash/compare", hash.compare);
app.use("/api/v1", v1Router);
app.use("/api/v2", v2Router);
