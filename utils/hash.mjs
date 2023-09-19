import bcrypt from "bcrypt";

export async function createHash(input) {
  const genSalt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(input, genSalt);
  return hashed;
}

export async function compareHash(plainText, hash) {
  const result = await bcrypt.compare(plainText, hash);
  return result;
}
