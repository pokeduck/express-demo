import express from "express";

/**
 *
 * @param {express.Response} res
 * @param {object} payload
 * @param {string | number} errorCode
 * @param {string} errorMessage
 * @param {string | number} statusCode
 */
const responseHandler = (
  res,
  payload,
  errorCode,
  errorMessage,
  statusCode = 200
) => {
  let resObj = {
    success: false,
    data: null,
    //error: null,
  };
  let _statusCode = statusCode || 200;

  if (payload !== null) {
    resObj.data = payload;
    resObj.success = true;
  }
  if (errorCode !== undefined || errorMessage !== undefined) {
    const error = {
      code: `${errorCode}`,
      message: `${errorMessage}`,
    };
    resObj.error = error;
    resObj.success = false;
  } else {
    resObj.success = true;
  }

  res.status(_statusCode).json(resObj);
};
export default responseHandler;
