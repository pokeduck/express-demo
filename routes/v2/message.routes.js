import express from "express";
import * as messageValidator from "../../validators/message.validator.js";
import validationHandler from "../../validators/result.validator.js";

import messageController from "../../controllers/message.controller.js";
export default () => {
  const router = express.Router();
  router.get(
    "/:id",
    messageValidator.id,
    validationHandler,
    messageController.id
  );
  router.post(
    "/create",
    messageValidator.create,
    validationHandler,
    messageController.create
  );
  return router;
};
