import dotenv from "dotenv";
import express, {Request, Response} from "express";
import cors from "cors";
import helmet from "helmet";
dotenv.config();

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());


app.get('/', (req: Request, res: Response) => res.send(`I'm a working server`));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

