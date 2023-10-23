export const logger = (err, req, res, next) => {
  console.log(`[error] ${err.message}`);
  next(err);
};
export const responder = (err, req, res, next) => {
  const status = err.status || 400;
  res.status(status).json({ message: err.message });
};
import express from "express";
export const invalidPath = (req, res, next) => {
  res.status(404).json({ message: "resource not found", request: req.path });
};
