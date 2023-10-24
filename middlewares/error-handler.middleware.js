export const logger = (err, req, res, next) => {
  console.log(`[error][message] ${err.message}`);
  console.log(`[error][status] ${err.status}`);
  console.log(`[error][stack] ${err.stack}`);
  console.log(`[error][constructor] ${err.constructor}`);
  console.log(`[error][name] ${err.name}`);
  //SequelizeConnectionError
  //SequelizeConnectionRefusedError
  //SequelizeAccessDeniedError
  if (err.name.includes("Sequelize")) {
    const newError = Error("internal error");
    newError.status = 500;
    next(newError);
  } else {
    next(err);
  }
};
export const responder = (err, req, res, next) => {
  const status = err.status || 400;
  res.status(status).json({ message: err.message });
};
import express from "express";
export const invalidPath = (req, res, next) => {
  if (req.headers.accept.split(",").indexOf("text/html") >= 0) {
    res.render("404-not-found");
  } else {
    res.status(404).json({ message: "resource not found", request: req.path });
  }
};
