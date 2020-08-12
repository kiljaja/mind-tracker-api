import express, { Response, Request, Router } from 'express';
import passport from 'passport';

import { generateToken } from '../service/jwt-service';

export const userController: Router = express.Router();

//TODO: move interface to common module
interface CustomUser {
  username: string;
}

userController.post(
  '/register',
  passport.authenticate('register', { session: false, failWithError: true }),
  async (req: Request, res: Response) => {
    try {
      const { username } = req.user as CustomUser;
      const token = await generateToken(username);
      res.status(200).json({
        message: 'User login successful',
        token: token,
        user: req.user,
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
);

userController.post(
  '/login',
  passport.authenticate('login', { session: false, failWithError: true }),
  async (req: Request, res: Response) => {
    try {
      const { username } = req.user as CustomUser;
      const token = await generateToken(username);
      res.status(200).json({
        message: 'User login successful',
        token: token,
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
);
