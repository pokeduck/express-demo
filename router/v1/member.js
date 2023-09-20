import { Sequelize, DataTypes } from "sequelize";
import * as Token from "../v1/auth.mjs";
import * as Hash from "../../utils/hash.mjs";
//const require = createRequire(import.meta.url);
//const userDAO = require("../../models/user.js");
import userDAO from "../../models/users.js";
import tokenDAO from "../../models/token.js";
import { error, log } from "console";
import { readFile } from "fs";
import { Router, query } from "express";
import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
import nodemailer from "nodemailer";

const sequelize = new Sequelize("db_dev", "root", "root", {
  host: "127.0.0.1",
  port: "8888",
  dialect: "mysql",
  logging: (...msg) => console.log(msg),
});

const User = userDAO(sequelize, DataTypes);
const TokenQuery = tokenDAO(sequelize, DataTypes);
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

export async function createEmailVerifyToken(req, res) {
  try {
    const uid = req.body.uid;
    console.log(uid);
    if (uid === undefined) {
      res.status(500).json({ message: "uid not found." });
      return;
    }
    const queryUser = await User.findAll({ where: { userId: uid } });
    if (queryUser === undefined) {
      res.status(500).json({ message: "user not found." });
      return;
    }

    if (queryUser.verificationStatus == true) {
      res.status(200).json({ message: "already verificated." });
      return;
    }

    const emailToken = Token.generateAccessToken({ uid: uid });
    const saveToken = await TokenQuery.create({
      userId: uid,
      tokenValue: emailToken,
      usageState: "valid",
      tokenType: "email",
    });
    await saveToken.save();

    sendMailWithEthereal(emailToken, (result) => {
      res.status(200).json({ token: emailToken, mailInfo: result });
    });
  } catch (e) {
    log(e);
    res.status(500).json({ message: "server error." });
  }
}

export async function verifyEmailToken(req, res) {
  function sendExpired(res) {
    if (accepts.includes("text/html")) {
      res
        .status(200)
        .set("Content-Type", "text/html")
        .sendFile("verification-expired.html", { root: __dirname });
    } else {
      res.status(200).json({ message: "連結過期！" });
    }
  }
  console.log(req.headers);
  console.log(req.query);
  const accepts = req.headers["accept"];
  try {
    const token = req.query.token;
    log("input token:" + token);
    if (token === undefined) {
      sendExpired(res);
      return;
    }
    const queryToken = await TokenQuery.findAll({
      where: {
        tokenValue: token,
      },
    });
    log("queryToken:" + queryToken);
    if (queryToken === undefined || queryToken.length === 0) {
      sendExpired(res);
      return;
    }
    if (queryToken.usageState === "invalid") {
      sendExpired(res);
      return;
    }

    const decode = await Token.verifyAccessToken(token);
    log("decode" + decode.uid);
    const uid = decode.uid;
    const user = await User.findAll({ where: { userId: uid } });
    log("queryUser" + user);
    if (user === undefined) {
      sendExpired(res);
      return;
    }

    const updateUser = await User.update(
      {
        verificationStatus: "true",
      },
      {
        where: {
          userId: uid,
        },
      }
    );

    if (updateUser[0] == 0) {
      sendExpired(res);
      return;
    }

    const updateToken = await TokenQuery.update(
      { usageState: "invalid" },
      {
        where: {
          tokenValue: token,
        },
      }
    );

    if (updateToken[0] == 0) {
      sendExpired(res);
      return;
    }
    if (accepts.includes("text/html")) {
      res
        .status(200)
        .set("Content-Type", "text/html")
        .sendFile("verification-success.html", { root: __dirname });
    } else {
      res.status(200).json({ message: "驗證完成" });
    }
  } catch (e) {
    log(e.message);
    sendExpired(res);
    //res.status(500).json({ message: "server error" });
  }
  /*   if (accepts.includes("text/html")) {
    if (req.query.token === "123") {
      res
        .status(200)
        .set("Content-Type", "text/html")
        .sendFile("verification-success.html", { root: __dirname });
    } else {
      res
        .status(200)
        .set("Content-Type", "text/html")
        .sendFile("verification-expired.html", { root: __dirname });
    }
  } else {
    res.status(200).json({ message: "ok" });

  } */
  /* res.status(200).json({
    message: "ok",
    req: req.headers["accept"].split(","),
    query: req.query,
  }); */
}

const transporter = nodemailer.createTransport({
  //host: process.env.SMTP_HOST,
  service: "Gmail",
  port: 465,
  secure: false,
  auth: {
    user: process.env.SMTP_USER_ADDRESS,
    pass: process.env.SMTP_USER_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
  },
});
async function testMail() {
  try {
    const info = await transporter.sendMail({
      from: `${process.env.SMTP_USER}<${process.env.SMTP_USER_ADDRESS}>`,
      to: `${process.env.SMTP_USER}<${process.env.SMTP_USER_ADDRESS}>`,
      subject: "hello",
      html: "<html>this is sample mail</html>",
    });
    log("Message sent: %s", info.messageId);
  } catch (e) {
    error(e);
  }
}

function sendMailWithEthereal(mailToken, cb) {
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error("Failed to create a testing account");
      console.error(err);
      return process.exit(1);
    }

    console.log("Credentials obtained, sending message...");

    // NB! Store the account object values somewhere if you want
    // to re-use the same account for future mail deliveries

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport(
      {
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
        logger: true,
        transactionLog: true, // include SMTP traffic in the logs
        allowInternalNetworkInterfaces: false,
      },
      {
        // default message fields

        // sender info
        from: "Nodemailer <example@nodemailer.com>",
        headers: {
          "X-Laziness-level": 1000, // just an example header, no need to use this
        },
      }
    );

    // Message object
    let message = {
      // Comma separated list of recipients
      to: "Nodemailer <example@nodemailer.com>",

      // Subject of the message
      subject: "Nodemailer is unicode friendly ✔" + Date.now(),

      // plaintext body
      text: "Hello to myself!",

      // HTML body
      html: `<p><a href="http://127.0.0.1:${process.env.API_PORT}/api/v1/user/verifyEmailToken?token=${mailToken}">Verify Email</a></p><p>Or Click Link</p><p><a href="http://127.0.0.1:${process.env.API_PORT}/api/v1/user/verifyEmailToken?token=${mailToken}">http://127.0.0.1:${process.env.API_PORT}/api/v1/user/verifyEmailToken?token=${mailToken}</a></p><p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>
        <p>Here's a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>`,

      // AMP4EMAIL
      amp: `<!doctype html>
        <html ⚡4email>
          <head>
            <meta charset="utf-8">
            <style amp4email-boilerplate>body{visibility:hidden}</style>
            <script async src="https://cdn.ampproject.org/v0.js"></script>
            <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
          </head>
          <body>
            <p><b>Hello</b> to myself <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
            <p>No embedded image attachments in AMP, so here's a linked nyan cat instead:<br/>
              <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
          </body>
        </html>`,

      // An array of attachments
      attachments: [
        // String attachment
        {
          filename: "notes.txt",
          content: "Some notes about this e-mail",
          contentType: "text/plain", // optional, would be detected from the filename
        },

        // Binary Buffer attachment
        {
          filename: "image.png",
          content: Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/" +
              "//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U" +
              "g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC",
            "base64"
          ),

          cid: "note@example.com", // should be as unique as possible
        },

        // File Stream attachment
        {
          filename: "nyan cat ✔.gif",
          path: __dirname + "nyan.gif",
          cid: "nyan@example.com", // should be as unique as possible
        },
      ],

      list: {
        // List-Help: <mailto:admin@example.com?subject=help>
        help: "admin@example.com?subject=help",

        // List-Unsubscribe: <http://example.com> (Comment)
        unsubscribe: [
          {
            url: "http://example.com/unsubscribe",
            comment: "A short note about this url",
          },
          "unsubscribe@example.com",
        ],

        // List-ID: "comment" <example.com>
        id: {
          url: "mylist.example.com",
          comment: "This is my awesome list",
        },
      },
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log("Error occurred");
        console.log(error.message);
        return process.exit(1);
      }

      console.log("Message sent successfully!");
      console.log(nodemailer.getTestMessageUrl(info));
      cb(nodemailer.getTestMessageUrl(info));
      // only needed when using pooled connections
      transporter.close();
    });
  });
}
