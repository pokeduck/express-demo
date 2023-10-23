import express from "express";
import * as member from "./member.js";
import * as hash from "./hash_test.js";
import * as Auth from "./auth.mjs";
import * as signUpValidator from "../../validators/signUp.validator.js";
import validationHandler from "../../validators/result.validator.js";

const router = express.Router();
export default router;

router.post("/user/signIn", member.signIn);
router.post(
  "/user/signUp",
  signUpValidator.signUp,
  validationHandler,
  member.signUp
);
router.get("/user/verifyEmailToken", member.verifyEmailToken);
//v1Router.use(Auth.tokenParser);
router.post(
  "/user/sendVerifyEmailToken",
  Auth.tokenParser,
  member.createEmailVerifyToken
);
router.post("/user/modify", Auth.tokenParser, member.modify);
router.get("/user/detail", Auth.tokenParser, member.detail);
router.get("/hash/create", Auth.tokenParser, hash.create);
router.get("/hash/compare", Auth.tokenParser, hash.compare);
