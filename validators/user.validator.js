import { body, param } from "express-validator";
const passwordValidator = () => {
  return body("password")
    .notEmpty()
    .withMessage("password must not empty")
    .isLength({ min: 3 })
    .withMessage("password must be 3 characters long.");
};
const signInValidator = () => {
  return body("email")
    .notEmpty()
    .withMessage("email must not empty")
    .isEmail()
    .withMessage("email format wrong.");
};
const userNameValidator = () => {
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
    });
};
export const signIn = [signInValidator(), passwordValidator()];

export const signUp = [userNameValidator()];
