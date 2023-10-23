import express, { Router } from "express";

import cookieParser from "cookie-parser";
import { body, param, query, check } from "express-validator";
import cors from "cors";
import { corsOptions } from "./config/cors.config.js";
import { NOTFOUND } from "dns";

import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const app = express();
const port = process.env.API_PORT || 5678;

//const v1Router = express.Router();
import { v1Router } from "./router/v1/v1.router.js";
const v2Router = express.Router();

const logger = (req, res, next) => {
  console.log("[REQUEST]");
  console.log("[QUERY]");
  console.log(req.query);
  console.log("[BODY]");
  console.log(req.body);
  next();
};
app.disable("x-powered-by");
app.set("views", __dirname + "/pages");
app.set("view engine", "ejs");
// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */
app.use(cookieParser());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({ extended: true })
); /* bodyParser.urlencoded() is deprecated */

//app.use(logger);

app.listen(port, () => {
  //console.log(process.env);
  console.log(`Domain: http://localhost:${port}`);
  console.log("Dirname: " + __dirname);
  console.log("Filename: " + __filename);
});
app.get("/hello", query("id").notEmpty, (req, res) => {
  res.json({ data: `hello id:${req.query.id}` });
});
app.get("/", (req, res) => {
  res.render("welcome");
  /* res
    //.cookie("g1", "d1", { expires: 0, maxAge: 10 * 1000 })
    //.cookie("g2", "d2")
    .json({
      data: "welcome my site.",
    }); */
});

app.use("/api/v1", v1Router);
app.use("/api/v2", v2Router);

app.use("/favicon.ico", express.static("images/favicon.ico"));
app.all("*", (req, res) => {
  res.status(404).json({ message: "unknown" });
});
