import { validationResult } from "express-validator";
export default async function validateHandler(req, res, next) {
  const validateForm = validationResult(req);
  const validateErrors = validateForm.array();
  if (validateErrors.length > 0) {
    //const result2 = validateForm.formatWith((error) => error.msg);

    res.status(422).json({ message: validateErrors[0].msg });
  } else {
    next();
  }
}
