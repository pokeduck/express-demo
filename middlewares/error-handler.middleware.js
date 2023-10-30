import responseHander from "../utils/responseHander.js";

export const logger = (err, req, res, next) => {
  console.log(`[error][message] ${err.message}`);
  console.log(`[error][status] ${err.status}`);
  console.log(`[error][stack] ${err.stack}`);
  console.log(`[error][constructor] ${err.constructor}`);
  console.log(`[error][name] ${err.name}`);
  //SequelizeConnectionError
  //SequelizeConnectionRefusedError
  //SequelizeAccessDeniedError
  const errName = err.name;
  if (err.name.includes("Sequelize")) {
    const newError = Error("internal error");
    newError.status = 500;
    next(newError);
  } else if (
    errName === "JsonWebTokenError" ||
    errName === "NotBeforeError" ||
    errName === "TokenExpiredError"
  ) {
    const newError = Error("token expired.");
    newError.status = 400;
    next(newError);
  } else {
    next(err);
  }
};
export const responder = (err, req, res, next) => {
  const status = err.status || 400;
  responseHander(res, null, status, err.message, status);
  //res.status(status).json({ message: err.message });
};
import express from "express";
export const invalidPath = (req, res, next) => {
  if (req.headers.accept.split(",").indexOf("text/html") >= 0) {
    res.render("404-not-found");
  } else {
    responseHander(res, null, 999, `${req.path} not found`, 400);
  }
};
