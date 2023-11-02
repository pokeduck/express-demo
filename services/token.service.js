import * as redis from "./redis.service.js";
import * as JWT from "../utils/jwt.js";
import { REFRESH_TOKEN_EXPIRE_TIME } from "../config/token.config.js";

export async function isValidRefreshToken(uid, token) {
  const lastToken = await redis.get(refreshTokenKeyFrom(uid));
  if (lastToken === null) {
    return false;
  }
  if (token === lastToken) {
    return true;
  }
  return false;
}
export async function signAndRewriteRefreshTokenToRedis(uid) {
  const token = JWT.generateRefreshTokenWithUid(uid);
  storeRefreshToken(uid, token);
  return token;
}
export async function storeRefreshToken(uid, token) {
  await redis.set(refreshTokenKeyFrom(uid), token, REFRESH_TOKEN_EXPIRE_TIME);
}

export async function cleanRefreshToken(uid) {}

function refreshTokenKeyFrom(uid) {
  return `user-refresh-token:${uid}`;
}
