import jwt, { decode } from "jsonwebtoken";
//const secretKey = process.env.JWT_SECRET_KEY;
const secretKey = "key";

function test() {
  const payload = {
    username: "name",
    id: 1,
  };

  const token = generateAccessToken(payload);
  console.log(token);

  const decode = verifyAccessToken(token);
  decode
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });
}
test();
//const decode = expressJWT({ecret: secretKey, algorithms: ["HS256"] });
//app.use(expressJWT({ secret:secretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }));
//console.log(decode);
export function generateAccessToken(payload) {
  const token = jwt.sign(payload, secretKey, { expiresIn: "360s" });
  return token;
}
export async function verifyAccessToken(token) {
  Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decode) => {
      if (error != null) {
        reject(error);
      } else {
        resolve(decode);
      }
    });
  });
}
export function authGrant(req, res) {}
