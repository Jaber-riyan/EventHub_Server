// models/user.model.ts
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, IUserMethods, UserModel } from "../interfaces/users.interface";

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: true, trim: true, unique: [true, "This name already used, try  with another name!"] },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: [true, "This email already used, try with another email!"],
      lowercase: true,
    },
    lastLoginTime: {
      type: Date,
      required: function () {
        return true
      },
      default: () => new Date(),
    },
    password: { type: String, required: true },
    photoURL: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// instance method
// userSchema.methods.passHashing = async function (plainPassword: string) {
//   return await bcrypt.hash(plainPassword, 10);
// };

// password pre-hash middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const User = model<IUser, UserModel>("User", userSchema);
