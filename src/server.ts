import 'dotenv/config';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const {Pool} = pg;
import express from 'express';
import { Request, Response } from 'express';
import * as PokerEvaluator from 'poker-evaluator';
import cors from "cors";
import register from './controllers/register.js';
import signIn from './controllers/signin.js';

declare global {
  namespace Express {
    export interface Request {
      user?: any;
    }
  }
}

export const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const app = express();
app.use(express.json());
app.use(cors())

const authenticateToken = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.status(401).send('Unauthorized');
    return;
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
    if (err) {
      res.status(403).send('Forbidden');
      return;
    }
    req.user = user;
    next();
  });
}

app.get('/', authenticateToken, (req: Request, res: Response) => {
  res.send('Hello World!!!');
});

app.post('/register', async (req: Request, res: Response) => { await register(req, res, pool, bcrypt)});
app.post('/signin', async (req: Request, res: Response) => { await signIn(req, res, pool, bcrypt)});

app.post('/eval', (req: Request, res: Response) => {
  const cards = req.body;
  const evaluations = [];
  for (let i = 0; i < cards.length; i++) { 
    evaluations.push(PokerEvaluator.evalHand(cards[i]));
  }
  res.status(200).json(evaluations);
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT ? process.env.PORT : 3000}`);
})
