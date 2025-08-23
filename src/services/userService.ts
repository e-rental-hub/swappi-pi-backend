import User from "../models/User";
import { IUser } from "../types";
import logger from "../config/loggingConfig"
import { Schema } from "mongoose";

export const authenticate = async (currentUser: IUser): Promise<IUser> => {
  try {
    logger.info("current user", {currentUser})
    let user = await User.findOne({
      uid: currentUser.uid,
      // username: currentUser.username
    }).exec();

    if (!user) {
      user = await User.create({
        uid: currentUser.uid,
        username: currentUser.username,
        roles: "pioneer"
      });
    }
    return user?.toObject();
  } catch (error: any) {
    console.error(`Failed to authenticate user: ${ error }`);
    throw error;
  }
};

export const getUser = async (uid: string): Promise<IUser | null> => {
  try {
    const user = await User.findOne({ uid }).exec();
    return user ? user as IUser : null;
  } catch (error: any) {
    console.error(`Failed to retrieve user for piUID ${ uid }: ${ error }`);
    throw error;
  }
};