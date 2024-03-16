import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import cookieParser from 'cookie-parser';

const transaction = async (req: Request, res: Response, pool, bcrypt) => {
  const {cookies, action} = req.body;
  // const cookie = req.cookies;
  let accessToken = cookies ? cookies.accessToken : null;
  console.log('cookie: ', cookies);
  if (!accessToken) {
    console.log('no token');
    res.status(401).send('Unauthorized');
    return;
  }
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
    if (err) {
      console.log(err);
      res.status(403).send('Forbidden');
      return; 
    }
    req.user = user; 
  });
  const client = await pool.connect();
  if (action.type === 'lookup') {
    try {
      const data = await client.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
      if (data.rows.length === 0) {
        res.status(401).send('Invalid email');
        return;
      }
      res.status(200).json(data.rows[0]);
    } catch (err) {
      res.status(500).send('Internal Server Error');
    } finally {
      await client.release();
    }
  } else if (action.type === 'update') {
    try {
      await client.query('BEGIN');
      const userBalanceRow = await client.query('SELECT money FROM users WHERE email = $1', [req.user.email]);
      if (userBalanceRow.rows.length === 0) {
        res.status(401).send('Invalid email');
        return;
      }
      const userBalance = Number(userBalanceRow.rows[0].money);
      const newBalance = action.take === true ? userBalance - action.amount : userBalance + action.amount;
      await client.query('UPDATE users SET money = $1 WHERE email = $2', [newBalance, req.user.email]);
      await client.query('COMMIT');
      console.log('Success');
      return res.status(200).json('Success');
    } catch (err) {
      await client.query('ROLLBACK');
      return res.status(500).send('Internal Server Error');
    } finally {
      await client.release();
    }
  } else {
    res.status(400).send('Bad Request');
    await client.release();
  } 
}

export default transaction;
