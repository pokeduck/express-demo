import jwt, { decode } from "jsonwebtoken";
import * as RedisRefreshToken from "../services/token.service.js";
import * as Hash from "./hash.mjs";
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME,
} from "../config/token.config.js";
const secretKey = process.env.JWT_SECRET_KEY ?? "key";

function test() {
  const payload = {
    username: "name",
    id: 1,
  };

  const token = generateAccessToken(payload);
  console.log(token);

  const decode = verifyToken(token);
  decode
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });
}
//test();
//const decode = expressJWT({ecret: secretKey, algorithms: ["HS256"] });
//app.use(expressJWT({ secret:secretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }));
//console.log(decode);

export function generateAccessTokenWithUid(uid) {
  const token = jwt.sign({ uid: uid }, secretKey, {
    expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
  });
  return token;
}

export async function getUidFromToken(token) {
  return verifyToken(token)
    .then((verifyResult) => {
      if (verifyResult.uid === undefined) {
        const error = new Error("access token expired.");
        error.status = 401;
        throw error;
      }
      return verifyResult.uid;
    })
    .catch((e) => {
      throw e;
    });
}

export function generateAccessToken(payload) {
  const token = jwt.sign(payload, secretKey, {
    expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
  });
  return token;
}
export function generateRefreshTokenWithUid(uid) {
  const token = jwt.sign({ uid: uid }, secretKey, {
    expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
  });
  return token;
}

export async function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decode) => {
      if (error != null) {
        console.log("verify token" + error);
        reject(error);
      } else {
        resolve(decode);
      }
    });
  });
}
export function authGrant(req, res) {}

export const tokenParser = (req, res, next) => {
  console.log("Cookies: ", req.cookies);
  console.log("Signed Cookies: ", req.signedCookies);
  console.log("middleware: Token Parser");

  const authHeaders = req.headers["authorization"];
  if (authHeaders === undefined) {
    res.status(403).json({ message: "unauthorize" });
    return;
  }
  const authToken = authHeaders.split(" ");
  if (authToken.length < 2) {
    res.status(403).json({ message: "unauthorize" });
    return;
  }
  const bearerToken = authToken[1];
  if (typeof bearerToken === undefined) {
    res.status(403).json({ message: "unauthorize" });
    return;
  }
  console.log("Token:" + bearerToken);
  verifyToken(bearerToken)
    .then((verifyResult) => {
      if (verifyResult.uid === undefined) {
        res.status(401).json({ message: "token expired" });
        return;
      }
      req.body.uid = verifyResult.uid;
      console.log("token uid:" + verifyResult?.uid ?? "");
      console.log("body uid:" + req?.body?.uid ?? "");
      next();
    })
    .catch((e) => {
      res.status(401).json({ message: e.message });
    });
};
