import express, { Router } from "express";

import * as member from "./router/v1/member.js";
const app = express();
const port = 3000;

const v1Router = express.Router();
const v2Router = express.Router();

const logger = (req, res, next) => {
  console.log(req.body);
  next();
};

app.get("/", (req, res) => {
  res.send("G_G_G_G");
});

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({ extended: true })
); /* bodyParser.urlencoded() is deprecated */

app.use(logger);

app.listen(port, () => {
  console.log(`port ${port}`);
});

v1Router.post("/user/sign_in", member.signIn);

app.use("/api/v1", v1Router);
app.use("/api/v2", v2Router);
