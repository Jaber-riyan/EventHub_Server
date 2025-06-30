// interfaces/user.interface.ts
import { Model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  lastLoginTime?: Date;
  photoURL?: string;
}

export interface IUserMethods {
  passHashing(password: string): Promise<string>;
}

export interface UserModel extends Model<IUser, {}, IUserMethods> {
  passHashing(password: string): Promise<string>;
}
