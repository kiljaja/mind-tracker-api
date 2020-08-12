import express, { Response, Request, Router, NextFunction } from 'express';
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
      const user = req.user as CustomUser;
      const token = await generateToken(user);
      res.status(201).json({
        message: 'User registration successful',
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
      const user = req.user as CustomUser;
      const token = await generateToken(user);
      res.status(200).json({
        message: 'User login successful',
        token: token,
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
);

userController.use(
  '/test',
  passport.authenticate('jwt', { session: false, failWithError: true }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as CustomUser;
      res.status(200).json({
        message: 'JWT Success',
        user,
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  },
  async (err: any, req: Request, res: Response, next: NextFunction) => {
    return res.status(401).send({ message: 'Invalid JWT Token' });
  }
);
