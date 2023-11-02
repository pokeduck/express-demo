import express from "express";
import userController from "../../controllers/user.controller.js";
import * as userValidator from "../../validators/user.validator.js";
import jwtMiddleware from "../../middlewares/jwt.middleware.js";
import token from "../../models/token.js";
export default () => {
  const router = express.Router();
  router.get("/profile", jwtMiddleware, userController.profile);
  router.post("/signIn", userValidator.signIn, userController.signIn);
  router.post("/signUp", userValidator.signUp, userController.signUp);
  router.post("/token", userValidator.token, userController.token);
  return router;
};
