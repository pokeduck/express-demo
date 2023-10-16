import { body } from "express-validator";

export const signUp = [
  body("userName")
    .notEmpty()
    .withMessage("user name cannot be empty.")
    .bail()
    .isLength({ min: 3 })
    .withMessage("user name must be 3 characters long.")
    .custom(async (value) => {
      console.log("custom validator");
      return true;
      //throw new Error("E-mail already in use");
      /* const user = await UserCollection.findUserByEmail(value);
      if (user) {
        throw new Error('E-mail already in use');
      } */
    }),
];
