import express from "express";
/**
 *
 * @param {express.Response} res
 * @param {string} renderFileName
 * @param {object} payload
 */
const renderHandler = (res, renderFileName, payload = {}) => {
  res
    .status(200)
    .set("Content-Type", "text/html")
    .render(renderFileName, payload);
};
export default renderHandler;
/* export default (res, renderFileName, payload = {}) => {
  res
    .status(200)
    .set("Content-Type", "text/html")
    .render(renderFileName, payload);
};
 */
