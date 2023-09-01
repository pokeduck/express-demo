import jwt from "jsonwebtoken";
import expressJWT from "express-jwt";

const secretKey = "JWE_SECRET_KEY";

const payload = {
  username: "name",
};
const token = jwt.sign(payload, secretKey, { expiresIn: "60s" });
console.log(token);
//const decode = expressJWT({ secret: secretKey, algorithms: ["HS256"] });
//app.use(expressJWT({ secret: secretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }));
//console.log(decode);
export function authGrant(req, res) {}
