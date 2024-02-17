import 'dotenv/config';
import pg from 'pg';
import bcrypt from 'bcrypt';
const { Pool } = pg;
import express from 'express';
import * as PokerEvaluator from 'poker-evaluator';
import cors from "cors";
import register from './controllers/register.js';
export const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});
const app = express();
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello World!!!');
});
app.post('/register', async (req, res) => { await register(req, res, pool, bcrypt); });
app.post('/eval', (req, res) => {
    const cards = req.body;
    const evaluations = [];
    for (let i = 0; i < cards.length; i++) {
        evaluations.push(PokerEvaluator.evalHand(cards[i]));
    }
    res.status(200).json(evaluations);
});
app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT ? process.env.PORT : 3000}`);
});
//# sourceMappingURL=server.js.map