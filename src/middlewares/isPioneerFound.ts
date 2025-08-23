import { NextFunction, Request, Response } from "express";

import platformAPIClient from "../config/platformAPIclient";
import logger from '../config/loggingConfig';

export const isPioneerFound = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader && authHeader.split(" ")[1];

    // logger.info(`Checking if Pioneer is found with token: ${authHeader}`);

    try {
      // Verify the user's access token with the /me endpoint:
      const me = await platformAPIClient.get(`/v2/me`, { 
        headers: { 'Authorization': `Bearer ${ tokenFromHeader }` }  
      });
      
      if (me && me.data) {
        const user = {
          uid: me.data.uid,
          username: me.data.username,
        }
        req.body.user = user;
        logger.info(`Pioneer found: ${user.uid} - ${user.username}`);
        return next();
      } else {
        logger.warn("Pioneer not found.");
        return res.status(404).json({message: "Pioneer not found"});
      }
    } catch (error: any) {
      logger.error('Failed to identify pioneer:', error.message);
      res.status(500).json({ message: 'Failed to identify | pioneer not found; please try again later'});
    }
  };
  