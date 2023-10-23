import { body, param } from "express-validator";
import { parseInt } from "lodash-es";
import resultValidator from "./result.validator.js";
export const id = [
  param("id")
    .notEmpty()
    .withMessage("message id must be not empty.")
    .custom(async (value) => {
      const intValue = parseInt(value);
      console.log(intValue);
      console.log(Number.isNaN(intValue));
      if (Number.isNaN(intValue)) {
        throw new Error("id must be integer.");
      } else {
        return true;
      }
    }),
  resultValidator,
];

export const create = [
  body("title").notEmpty().withMessage("must have title"),
  body("content").notEmpty().withMessage("must have content"),
  resultValidator,
];
