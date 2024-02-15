import { Request, Response } from 'express';

const register = (req: Request, res: Response, client) => {
  client.query('SELECT * FROM users', (err, r) => {
    if (!err) {
      console.log(r.rows);
      res.status(200).json(r.rows);
    }
    client.end();
  });
}
 
export default register;