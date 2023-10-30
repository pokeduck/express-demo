import express from "express";
import userController from "../../controllers/user.controller.js";
import * as userValidator from "../../validators/user.validator.js";
import jwtMiddleware from "../../middlewares/jwt.middleware.js";
export default () => {
  const router = express.Router();
  router.get("/profile", jwtMiddleware, userController.profile);
  router.post("/signIn", userValidator.signIn, userController.signIn);
  router.post("/signUp", userValidator.signUp, userController.signUp);
  return router;
};
