import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    tokenVersion: { 
      type: Number, 
      default: 0 
    },

    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.refreshToken;
    delete ret.__v;

    ret.id = ret._id;
    delete ret._id;

    return ret;
  },
});

export const User = mongoose.model("User", userSchema);
