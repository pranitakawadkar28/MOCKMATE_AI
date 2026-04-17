import { User } from "../../models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { hashPassword } from "../../utils/hash.js";

export const registerService = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    throw new AppError("PLEASE_PROVIDE_USERNAME,EMAIL,PASSWORD", 400);
  }

  const isUserAlreadyExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExist) {
    throw new AppError("USER_ALREADY_EXISTS", 401);
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    username,
    email, 
    password: hashedPassword
  })

  return { user };
};