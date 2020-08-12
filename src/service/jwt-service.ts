import jwt, { JwtHeader } from 'jsonwebtoken';

const JWT_KEY: jwt.Secret = process.env.JWT_KEY || 'secret key';
const SIGN_OPTIONS: jwt.SignOptions = {
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
};

export const generateToken = async (user: {}) => {
  const payload: {} = { user };
  const token: string = jwt.sign(payload, JWT_KEY, SIGN_OPTIONS);
  return token;
};

export const jwtService = {
  generateToken,
};
