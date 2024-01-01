import express from 'express';
import { Request, Response } from 'express';
import * as PokerEvaluator from 'poker-evaluator';
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!!!');
});

app.post('/eval', (req: Request, res: Response) => {
  console.log('Body: ' , req.body)
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