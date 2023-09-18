import jwt, { decode } from "jsonwebtoken";
import expressJWT from "express-jwt";

const secretKey = process.env.JWT_SECRET_KEY;

const payload = {
  username: "name",
  id: 1,
};
const token = jwt.sign(payload, secretKey, { expiresIn: "360s" });
console.log(token);
jwt.verify(token, secretKey, (error, decode) => {
  console.log(error);
  console.log(decode);
});
//const decode = expressJWT({ secret: secretKey, algorithms: ["HS256"] });
//app.use(expressJWT({ secret: secretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }));
//console.log(decode);
export function authGrant(req, res) {}
