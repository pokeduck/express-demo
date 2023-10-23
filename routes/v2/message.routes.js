import express from "express";
import * as messageValidator from "../../validators/message.validator.js";
import messageController from "../../controllers/message.controller.js";

export default () => {
  const router = express.Router();
  router.get("/:id", messageValidator.id, messageController.id);
  router.post("/create", messageValidator.create, messageController.create);
  router.post(
    "/createError",
    messageValidator.create,
    messageController.createWithError
  );
  return router;
};
