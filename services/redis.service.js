import { createClient } from "redis";
import config from "../config/redis.config.js";
//https://redis.io/docs/connect/clients/nodejs/
const client = createClient({
  url: `redis://${config.username}:${config.password}@${config.host}:${config.port}`,
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

export async function set(key, value, expTime = -1) {
  await client.set(key, value, { EX: expTime });
}

export async function get(key) {
  return await client.get(key);
}
