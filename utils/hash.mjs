import bcrypt from "bcrypt";

/**
 *
 * @param {string | Buffer } input
 * @returns {string}
 */
export function createHash(input) {
  const genSalt = bcrypt.genSaltSync(10);
  const hashed = bcrypt.hashSync(input, genSalt);
  return hashed;
}

/**
 *
 * @param {string} plainText
 * @param {string} hash
 * @returns {boolean}
 */
export function compareHash(plainText, hash) {
  const result = bcrypt.compareSync(plainText, hash);
  return result;
}
