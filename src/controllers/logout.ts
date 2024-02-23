import cookieParser from 'cookie-parser';
import { Request, Response } from 'express';

const logout = async (req: Request, res: Response) => {
  res.clearCookie('accessToken');
  res.status(200).send('Logged out'); 
}