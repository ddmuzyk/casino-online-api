import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const register = async (req: Request, res: Response, pool, bcrypt) => {
  const {username, email, password} = req.body;
  console.log(req.body);
  if (!username || !email || !password) {
    res.status(400).send('Bad Request');
    return;
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const data = await client.query('SELECT email, name FROM users WHERE email = $1 OR name = $2', [email, username]);
    console.log(data.rows);
    if (data.rows.length > 0) {
      res.status(409).send('User with these credentials already exists');
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      await client.query('BEGIN');
      await client.query('INSERT INTO users(name, email) VALUES($1, $2)', [username, email]);
      await client.query('INSERT INTO login(email, hash) VALUES($1, $2)', [email, hashedPassword]);
      await client.query('COMMIT');
      res.status(201).json("User successfully created");
    } catch (err){
      await client.query('ROLLBACK');
      res.status(500).send(err.message);
      return;
    }
  }
  catch (err) {
    res.status(500).send('Internal Server Error');
  }
  finally {
    await client.release();
  }
}
 
export default register;