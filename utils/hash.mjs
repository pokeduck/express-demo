import bcrypt from "bcrypt";

export function createHash(input) {
  const genSalt = bcrypt.genSaltSync(10);
  const hashed = bcrypt.hashSync(input, genSalt);
  return hashed;
}

export function compareHash(plainText, hash) {
  const result = bcrypt.compareSync(plainText, hash);
  return result;
}
