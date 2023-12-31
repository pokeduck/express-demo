/**
 * @type {{host:string,port:number,username:string,password:string}}
 */
const config = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
};
export default config;
