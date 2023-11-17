import * as redis from "./redis.service.js";
import * as JWT from "../utils/jwt.js";
import { REFRESH_TOKEN_EXPIRE_TIME } from "../config/token.config.js";

/**
 *
 * @param {string} uid
 * @param {string} token
 * @returns {boolean}
 */
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
/**
 *
 * @param {string} uid
 * @returns {boolean}
 */
export async function signAndRewriteRefreshTokenToRedis(uid) {
  const token = JWT.generateRefreshTokenWithUid(uid);
  storeRefreshToken(uid, token);
  return token;
}
/**
 *
 * @param {string} uid
 * @param {string} token
 */
export async function storeRefreshToken(uid, token) {
  await redis.set(refreshTokenKeyFrom(uid), token, REFRESH_TOKEN_EXPIRE_TIME);
}

/**
 *
 * @param {string} uid
 */
export async function cleanRefreshToken(uid) {}

/**
 *
 * @param {string} uid
 * @returns {string}
 */
function refreshTokenKeyFrom(uid) {
  return `user-refresh-token:${uid}`;
}
