import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(hashedPassword: string, password: string) {
  return await bcrypt.compare(password, hashedPassword);
}
