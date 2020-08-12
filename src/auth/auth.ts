import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import { userRepository } from '../repository/user-repository';

const LocalStrategy = passportLocal.Strategy;
const hashRounds = parseInt(process.env.HASH_ROUNDS as string, 10) || 10;

interface CustomUser {
  id?: number;
  username: string;
  password?: string;
  token?: string;
}
// User registrations
passport.use(
  'register',
  new LocalStrategy(async (username: string, password: string, done) => {
    try {
      const hashPassword = await bcrypt.hash(password, hashRounds);
      let newUser = (await userRepository.add(
        username,
        hashPassword
      )) as CustomUser;
      return done(null, newUser);
    } catch (error) {
      error.status = error?.status || 401;
      error.message = error?.detail || error?.message || 'Error registering';
      return done(error);
    }
  })
);

passport.use(
  'login',
  new LocalStrategy(async (username: string, password: string, done) => {
    try {
      const user = await userRepository.findByUserName(username);
      //No User found
      if (!user) throw new Error(`Login error username/password don't match`);
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid)
        throw new Error(`Login error username/password don't match`);
      const userInfo = {
        username: user.username,
      } as CustomUser;
      return done(null, userInfo);
    } catch (error) {
      error.status = error?.status || 401;
      error.message = error?.detail || error?.message || 'Login Error';
      return done(error);
    }
  })
);
