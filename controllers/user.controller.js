import UserDAO from "../models/users.js";
import { create } from "../routes/v1/hash_test.js";
import query from "../services/db.service.js";
import * as Hash from "../utils/hash.mjs";
import * as JWT from "../utils/jwt.js";
import uidFormat from "../utils/uid.js";
import responseHander from "../utils/responseHander.js";
import * as RedisRefreshToken from "../services/token.service.js";
import createEmailLink from "../services/ethereal.service.js";
import renderHandler from "../utils/renderHandler.js";
const userQuery = query(UserDAO);

class UserController {
  
  async signIn(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await userQuery.findOne({
        where: {
          email: email,
        },
      });
      if (user === null) {
        console.error("user not found.");
        responseHander(res, null, 400, "email or password wrong");
        return;
      }
      console.log(user);
      const result = Hash.compareHash(password, user.password);
      if (result === false) {
        console.error("password wrong.");
        responseHander(res, null, 400, "email or password wrong");
        return;
      }
      const newAccessToken = JWT.generateAccessTokenWithUid(user.userId);
      user.authToken = newAccessToken;
      await userQuery.update(
        {
          authToken: newAccessToken,
        },
        {
          where: {
            userId: user.userId,
          },
        }
      );
      const newRefreshToken =
        await RedisRefreshToken.signAndRewriteRefreshTokenToRedis(user.userId);
      user.refreshToken = newRefreshToken;
      responseHander(res, formatUser(user));
    } catch (error) {
      next(error);
    }
  }
  async profile(req, res, next) {
    try {
      const uid = req.body.uid;
      const user = await userQuery.findOne({ where: { userId: uid } });
      if (user === null) {
        responseHander(res, null, 400, "user not found.");
        return;
      }
      responseHander(res, formatUser(user));
    } catch (error) {
      next(error);
    }
  }
  async signUp(req, res, next) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const userName = req.body.userName;
      const sameUser = await userQuery.findOne({
        where: { email: email },
      });
      console.log(sameUser);
      if (sameUser !== null) {
        responseHander(res, null, "ER001", `${email} already exist.`);

        return;
      }
      const hashedPassword = Hash.createHash(password);
      const createDate = new Date();
      const createUser = await userQuery.create({
        userName: userName,
        email: email,
        password: hashedPassword,
        createdAt: createDate,
        updatedAt: createDate,
        verificationStatus: false,
      });
      const createdUid = createUser.id;
      const formatedUid = uidFormat(createdUid, createDate);
      const accessToken = JWT.generateAccessTokenWithUid(formatedUid);
      const updateUser = await userQuery.update(
        {
          authToken: accessToken,
          userId: formatedUid,
        },
        {
          where: {
            id: createdUid,
          },
        }
      );
      createUser.authToken = accessToken;
      createUser.userId = formatedUid;
      responseHander(res, formatUser(createUser));
    } catch (error) {
      next(error);
    }
  }
  async token(req, res, next) {
    try {
      const refreshToken = req.body?.refreshToken ?? "";
      const uid = await JWT.getUidFromToken(refreshToken);
      const newAccessToken = JWT.generateAccessTokenWithUid(uid);
      responseHander(res, {
        accessToken: newAccessToken,
        refreshToken: refreshToken,
      });
    } catch (error) {
      responseHander(
        res,
        null,
        403,
        "Your refreshToken has expired. Kindly proceed with signing in once more.",
        403
      );
    }
  }
  async verifyEmail(req, res, next) {
    const uid = req.body?.uid ?? "";
    const user = await userQuery.findOne({ where: { userId: uid } });
    if (user === null) {
      responseHander(res, null, 403, "unknown user");
      return;
    }
    if (
      user?.verificationStatus === null ||
      user?.verificationStatus === undefined ||
      user?.verificationStatus === false
    ) {
      const emailToken = JWT.generateEmailToken(uid);
      createEmailLink('1',)
      createEmailLink(emailToken, (link) => {
        responseHander(res, { etherealLink: link });
      });
    } else {
      responseHander(
        res,
        null,
        "ERROR_MAIL_01",
        "The email has previously been successfully validated."
      );
    }
  }
  async verifyEmailToken(req, res, next) {
    const accepts = req.headers?.accept ?? "";
    const emailToken = req.query?.token ?? "";

    function sendExpired(payload) {
      if (accepts.includes("text/html")) {
        renderHandler(res, "verification-expired", payload);
        return;
      }
      responseHander(
        res,
        null,
        403,
        "The verification link has expired.2",
        403
      );
    }
    function sendSuccess(payload) {
      if (accepts.includes("text/html")) {
        renderHandler(res, "verification-success", payload);
        return;
      }
      responseHander(res, { message: "驗證完成" });
    }
    try {
      const uid = await JWT.getUidFromToken(emailToken);
      const user = await userQuery.findOne({ where: { userId: uid } });
      const isVerified = user?.verificationStatus ?? "0";
      console.log("Email+" + emailToken);
      console.log(uid);
      console.log(isVerified);
      if (isVerified === "1") {
        sendExpired({ link: emailToken });
        return;
      }
      await userQuery.update(
        { verificationStatus: true },
        { where: { userId: uid } }
      );
      sendSuccess({
        user: user,
        token: emailToken,
      });
    } catch (error) {
      sendExpired({ link: emailToken });
    }
  }
}

function formatUser(user) {
  const isEmailVerified = (user?.verificationStatus ?? "0") === "1";
  return {
    id: user.id,
    uid: user.userId,
    userName: user.userName,
    email: user.email,
    accessToken: user.authToken,
    refreshToken: user.refreshToken,
    isEmailVerified: isEmailVerified,
  };
}

export default new UserController();
