import * as redis from "./redis.service.js";

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

export async function storeRefreshToken(uid, token) {
  await redis.set(refreshTokenKeyFrom(uid), token, 60);
}

export async function cleanRefreshToken(uid) {}

function refreshTokenKeyFrom(uid) {
  return `user-refresh-token:${uid}`;
}
