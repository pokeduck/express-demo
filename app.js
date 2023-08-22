import express, { Router } from "express";

import * as user from "./user.js";
const app = express();
const port = 3000;
let r1 = express.Router();

app.get("/", (req, res) => {
  res.send("G_G_G_G");
});

app.listen(port, () => {
  console.log(`port ${port}`);
});

app.use("/user", r1);

r1.get("/", user.all);
