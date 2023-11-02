import responseHander from "../utils/responseHander.js";
import * as JWT from "../utils/jwt.js";

export default (req, res, next) => {
  console.log("Cookies: ", req.cookies);
  console.log("Signed Cookies: ", req.signedCookies);
  console.log("middleware: Token Parser");

  const authHeaders = req.headers["authorization"];
  if (authHeaders === undefined) {
    responseHander(res, null, 403, "unauthorize");
    return;
  }
  const authToken = authHeaders.split(" ");
  if (authToken.length < 2) {
    responseHander(res, null, 403, "unauthorize");
    return;
  }
  const bearerToken = authToken[1];
  if (typeof bearerToken === undefined) {
    responseHander(res, null, 403, "unauthorize");
    return;
  }
  console.log("Access Token:" + bearerToken);
  const uid = JWT.getUidFromToken(bearerToken)
    .then((uid) => {
      console.log("decode uid: " + uid);
      req.body.uid = uid;
      next();
    })
    .catch((e) => {
      next(e);
    });
};
