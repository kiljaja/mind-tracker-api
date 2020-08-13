import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
dotenv.config();
// ----------------------------------------------------------------------- //

import { pool } from './db/db';
import './auth/auth';
import { userController } from './controller/user-controller';
import { meditationController } from './controller/meditation-controller';

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => res.send(`I'm a working server`));

app.use('/user', userController);
app.use('/meditation', meditationController);

// Handler errors
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  res.status(err.status || 500);
  res.json({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
