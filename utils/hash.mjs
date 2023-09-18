import bcrypto from "bcrypt";

export async function createHash(input) {
  const genSalt = await bcrypto.genSalt(10);
  const hashed = await bcrypto.hash(input, genSalt);
  return hashed;
}

export async function compareHash(plainText, hash) {
  const result = await bcrypto.compare(plainText, hash);
  return result;
}
