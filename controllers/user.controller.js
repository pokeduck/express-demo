import UserDAO from "../models/users.js";
import { create } from "../routes/v1/hash_test.js";
import query from "../services/db.service.js";
import * as Hash from "../utils/hash.mjs";
import * as JWT from "../utils/jwt.js";
import uidFormat from "../utils/uid.js";
const userQuery = query(UserDAO);
class UserController {
  async signIn(req, res, next) {
    next(new Error("error test"));
    //res.status(200).json({ message: "signin" });
  }
  async profile(req, res, next) {
    try {
    } catch (error) {}
    res.status(200).json({ message: "profile" });
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
        res.status(200).json({ message: `${email} already exist.` });
        return;
      }
      const hashedPassword = await Hash.createHash(password);
      const createDate = new Date();
      const createUser = await userQuery.create({
        userName: userName,
        email: email,
        password: hashedPassword,
        createdAt: createDate,
        updatedAt: createDate,
      });
      const createdUid = createUser.id;
      const formatedUid = uidFormat(createdUid, createDate);
      const accessToken = JWT.generateAccessToken({ uid: formatedUid });
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
      res.status(200).json({ message: createUser });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
