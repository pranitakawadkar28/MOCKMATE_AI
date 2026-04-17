import bcrypt from "bcryptjs"

const SALT = 10;

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT)
}