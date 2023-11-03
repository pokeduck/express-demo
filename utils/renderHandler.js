export default (res, renderFileName, payload = {}) => {
  res
    .status(200)
    .set("Content-Type", "text/html")
    .render(renderFileName, payload);
};
