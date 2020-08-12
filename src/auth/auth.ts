import passport, { Passport } from 'passport';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import bcrypt from 'bcrypt';
import { userRepository } from '../repository/user-repository';

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const hashRounds = parseInt(process.env.HASH_ROUNDS as string, 10) || 10;
const JWT_KEY = process.env.JWT_KEY || 'secret key';

interface CustomUser {
  id: number;
  username: string;
  password?: string;
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
        id: user.id,
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

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_KEY,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      return done(null, jwt_payload.user);
    } catch (error) {
      error.status = error?.status || 401;
      error.message = error?.detail || error?.message || `Invalid JWT TOKEN`;
      return done(error, null, {message: "failed jwt"});
    }
  })
);
