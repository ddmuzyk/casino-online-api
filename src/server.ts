import express from 'express';
import { Request, Response } from 'express';
import * as PokerEvaluator from 'poker-evaluator';
import cors from "cors";

// PokerEvaluator.evalHand(['As', 'Ks', 'Qs', 'Js', 'Ts', '3c', '7d']);
// Evaluate a different hand
PokerEvaluator.evalHand(['Js', '3h', '2d', 'Tc', 'Qh', '8s', '5d'])


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

app.listen(3000)