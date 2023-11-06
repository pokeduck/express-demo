import express from "express";
import * as messageValidator from "../../validators/message.validator.js";
import messageController from "../../controllers/message.controller.js";
import jwtMiddleware from "../../middlewares/jwt.middleware.js";
export default () => {
  const router = express.Router();
  router.get("/:id", messageValidator.id, messageController.id);
  router.post(
    "/create",
    jwtMiddleware,
    messageValidator.create,
    messageController.create
  );
  router.post(
    "/createError",
    messageValidator.create,
    messageController.createWithError
  );
  router.post(
    "/upvote",
    jwtMiddleware,
    messageValidator.upvote,
    messageController.upvote
  );
  router.post(
    "/action",
    jwtMiddleware,
    messageValidator.action,
    messageController.action
  );
  return router;
};
