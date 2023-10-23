import express from "express";
import postRoutes from "./post.routes.js";
import userRoutes from "./user.routes.js";
import messageRoutes from "./message.routes.js";
export default () => {
  const router = express.Router();
  router.use("/user", userRoutes());
  router.use("/post", postRoutes());
  router.use("/message", messageRoutes());
  return router;
};
