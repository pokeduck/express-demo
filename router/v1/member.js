import { Sequelize, DataTypes } from "sequelize";
import * as Token from "../v1/auth.mjs";
//const require = createRequire(import.meta.url);
//const userDAO = require("../../models/user.js");
import userDAO from "../../models/users.js";
import { error } from "console";
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
    // Find all users
    const users = await User.findAll();
    console.log(users.every((user) => user instanceof User)); // true
    const allUsers = JSON.stringify(users, null, 2);
    console.log("All users:", allUsers);
    res.status(500).json({ message: "G_G" });
    //res.json(users);
    //res.send(allUsers);
    //await sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    res.send("fail");
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

export async function modify(req, res) {
  try {
    const b = req.body;
    console.log(b.id);
    if (b.id === undefined) {
      res.status(500).json({ message: "must have id" });
      return;
    }
    const newDate = new Date();

    const update = await User.update(
      {
        firstName: b.firstName,
        lastName: b.lastName,
        updatedAt: newDate,
      },
      {
        where: {
          id: b.id,
        },
      }
    );
    console.log(update);
    if (update[0] == 0) {
      res.json({ result: "user not found" });
    } else {
      res.json({ result: "success" });
    }
  } catch (e) {
    res.status(500).json({ message: "Unknown id" });
  }
}
