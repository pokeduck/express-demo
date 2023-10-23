import express, { Router } from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from "./config/cors.config.js";
import * as ErrorHandler from "./middlewares/error-handler.js";

import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const app = express();
const port = process.env.API_PORT || 5678;

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
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//app.use(logger);

app.listen(port, () => {
  //console.log(process.env);
  console.log(`Domain: http://localhost:${port}`);
  console.log("Dirname: " + __dirname);
  console.log("Filename: " + __filename);
});

app.get("/", (req, res) => {
  res.render("welcome");
});
import v1Router from "./routes/v1/index.routes.js";
import v2Router from "./routes/v2/index.routes.js";

app.use("/api/v1", v1Router);
app.use("/api/v2", v2Router());

app.use("/favicon.ico", express.static("images/favicon.ico"));

app.use(ErrorHandler.logger);
app.use(ErrorHandler.responder);
app.use(ErrorHandler.invalidPath);
