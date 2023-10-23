import express from "express";
import userController from "../../controllers/user.controller.js";
import * as userValidator from "../../validators/user.validator.js";
import validationHandler from "../../validators/result.validator.js";

export default () => {
  const router = express.Router();
  router.get("/profile", userController.profile);
  router.post(
    "/signIn",
    userValidator.signIn,
    validationHandler,
    userController.signIn
  );
  return router;
};
