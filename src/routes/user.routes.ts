import { Router } from 'express';
import * as userController from '../controllers/userController';
import { isPioneerFound } from '../middlewares/isPioneerFound';
import { verifyToken } from '../middlewares/verifyToken';

const userRoutes = Router();

userRoutes.post('/authenticate', isPioneerFound, userController.authenticateUser);
userRoutes.get("/me", verifyToken, userController.autoLoginUser); 

// userRoutes.get('/signout', signOut);

export default userRoutes;