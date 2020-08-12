import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
dotenv.config();
// ----------------------------------------------------------------------- //

import { pool } from './db/db';
import { userRepository } from './repository/user-repository';

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => res.send(`I'm a working server`));


//Test user Repo
app.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const newUser = await userRepository.add(username, password);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(401).json(error);
  }
});

//test database
app.get('/db', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM test_table');
    const results = { results: result ? result.rows : null };
    res.status(201).json(results);
  } catch (err) {
    console.error(err);
    res.send('Error ' + err);
  }
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
