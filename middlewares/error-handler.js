export const logger = (err, req, res, next) => {
  console.log(`[error] ${err.message}`);
  next(err);
};
export const responder = (err, req, res, next) => {
  const status = err.status || 400;
  res.status(status).json({ message: err.message });
};
export const invalidPath = (err, req, res, next) => {};
