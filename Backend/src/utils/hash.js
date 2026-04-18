import bcrypt, { hash } from "bcryptjs";

const SALT = 10;

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT);
};

export const comparePassword = async (plainPassword, hashPassword) => {
  return await bcrypt.compare(plainPassword, hashPassword);
};
