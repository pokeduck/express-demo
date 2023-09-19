import { Sequelize, DataTypes } from "sequelize";
import * as Token from "../v1/auth.mjs";
import * as Hash from "../../utils/hash.mjs";
//const require = createRequire(import.meta.url);
//const userDAO = require("../../models/user.js");
import userDAO from "../../models/users.js";

import { error } from "console";
import { access } from "fs";
import { Router } from "express";
const sequelize = new Sequelize("db_dev", "root", "root", {
  host: "127.0.0.1",
  port: "8888",
  dialect: "mysql",
  logging: (...msg) => console.log(msg),
});

const User = userDAO(sequelize, DataTypes);

export async function signIn(req, res) {
  // Create a new user
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    const email = req.body.email;
    const password = req.body.password;
    // Query for user
    const users = await User.findAll({
      where: {
        email: email,
      },
    });
    const firstUser = users[0];
    if (firstUser === undefined) {
      res.status(403).json({ message: "user not found." });
      return;
    }
    //console.log(users);
    //console.log(firstUser);
    const firstUserHash = firstUser.password;
    //console.log("db pwd: " + firstUserHash);
    //console.log("input pwd: " + password);
    const compareResult = await Hash.compareHash(password, firstUserHash);
    console.log(compareResult);
    if (compareResult === false) {
      //console.log("password wrongn.");
      res.status(403).json({ message: "password wrong." });
      return;
    }
    //console.log("password correct.");

    const accessToken = Token.generateAccessToken({
      userName: firstUser.userName,
      uid: firstUser.userId,
    });
    console.log(accessToken);
    const updateToken = await User.update(
      { authToken: accessToken },
      {
        where: {
          email: email,
        },
      }
    );
    firstUser.authToken = accessToken;
    res.status(200).json({ token: accessToken, data: firstUser });

    //console.log(users.every((user) => user instanceof User)); // true
    //const allUsers = JSON.stringify(users, null, 2);
    //console.log("All users:", allUsers);
    //res.status(500).json({ message: "G_G" });
    //res.json(users);
    //res.send(allUsers);
    //await sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    res.status(500).json({ message: "server error" });
  }
}
export async function signUp(req, res) {
  try {
    const b = req.body;
    console.log(b.firstName + b.lastName + b.email);
    const newDate = new Date();
    const newToken = Token.generateAccessToken({ name: b.firstName });
    const newUser = await User.create({
      firstName: b.firstName,
      lastName: b.lastName,
      email: b.email,
      createdAt: newDate,
      updatedAt: newDate,
      authToken: newToken,
    });
    await newUser.save();
    res.json({ result: "success" });
  } catch (e) {
    console.error(error);
    res.status(500).json(error);
  }
}
function func1(var1) {
  console.log(var1.cat); //1
  console.log(var1.dog); //undefined
}

export async function detail(req, res) {
  try {
    const uid = req.body.uid;
    const user = await User.findAll({
      where: {
        userId: uid,
      },
    });

    if (user === undefined) {
      res.status(401).json({ message: "token expired" });
      return;
    }
    const newToken = Token.generateAccessToken({
      userName: user.userName,
      uid: user.userId,
    });

    user.authToken = newToken;
    res.status(200).json({ token: newToken, data: user });
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      res.status(401).json({ message: "token expired" });
      return;
    }
    res.status(500).json({ message: e.message });
  }
}

export async function modify(req, res) {
  try {
    const b = req.body;

    console.log(b.uid);
    if (b.uid === undefined) {
      res.status(500).json({ message: "must have id" });
      return;
    }
    const newDate = new Date();

    const update = await User.update(
      {
        userName: b.userName,
      },
      {
        where: {
          userId: b.uid,
        },
      }
    );
    console.log(update);
    if (update[0] == 0) {
      res.status(400).json({ message: "user not found" });
    } else {
      res.status(200).json({ message: "success" });
    }
  } catch (e) {
    res.status(400).json({ message: "Unknown id" });
  }
}
