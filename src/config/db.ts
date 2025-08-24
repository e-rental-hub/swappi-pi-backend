import mongoose from "mongoose";

import { env } from "../utils/env";
import logger from "./loggingConfig";

export const connectDB = async () => {
  try {
    // Only log the MongoDB URL in non-production environments
    if (env.NODE_ENV !== 'production') {
      logger.info(`Connecting to MongoDB with URL: ${env.MONGODB_URL}`);
    }
    const conn = await mongoose.connect(env.MONGODB_URL, {
      // serverSelectionTimeoutMS: 5000,
      minPoolSize: env.MONGODB_MIN_POOL_SIZE,
      maxPoolSize: env.MONGODB_MAX_POOL_SIZE
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('Failed connection to MongoDB:', error);
  }
};
