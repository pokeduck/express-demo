import { createRequire } from "module";
const require = createRequire(import.meta.url);
const commonjsModule = require("../../models/user.js");
export function signIn(req, res) {
  res.send("success");
}

/* module.exports.signIn = (req, res) => {
  res.send("success");
}; */
