const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialet: process.env.DB_DIALECT,
  table: process.env.DB_TABLE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
};
export default config;
