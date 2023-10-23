import express from "express";
import * as member from "./member.js";
import * as hash from "./hash_test.js";
import * as Auth from "./auth.mjs";
import * as signUpValidator from "../../validators/signUp.validator.js";
import validationHandler from "../../validators/result.validator.js";

export const v1Router = express.Router();

v1Router.post("/user/signIn", member.signIn);
v1Router.post(
  "/user/signUp",
  signUpValidator.signUp,
  validationHandler,
  member.signUp
);
v1Router.get("/user/verifyEmailToken", member.verifyEmailToken);
//v1Router.use(Auth.tokenParser);
v1Router.post(
  "/user/sendVerifyEmailToken",
  Auth.tokenParser,
  member.createEmailVerifyToken
);
v1Router.post("/user/modify", Auth.tokenParser, member.modify);
v1Router.get("/user/detail", Auth.tokenParser, member.detail);
v1Router.get("/hash/create", Auth.tokenParser, hash.create);
v1Router.get("/hash/compare", Auth.tokenParser, hash.compare);
