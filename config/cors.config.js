const whitelist = [`http://localhost:${process.env.API_PORT}`];
export const corsOptions = {
  origin: function (origin, callback) {
    console.log("origin:" + origin);
    console.log("allowlist:" + whitelist);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
