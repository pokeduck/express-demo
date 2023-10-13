import { body, param } from "express-validator";

export const signUp = [
  body("userName1")
    .notEmpty()
    .withMessage("user name cannot be empty.")
    .bail()
    .isLength({ min: 3 })
    .withMessage("user name must be 3 characters long."),
];
