import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const signIn = async (req: Request, res: Response, pool, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Bad Request");
    return;
  }
  const client = await pool.connect();
  try {
    const data = await client.query("SELECT * FROM login WHERE email = $1", [email]);
    if (data.rows.length === 0) {
      res.status(401).send("Invalid email or password");
      return;
    }
    const valid = await bcrypt.compare(password, data.rows[0].hash);
    if (!valid) {
      res.status(401).send("Invalid email or password");
      return;
    }
    const user = { email };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "24h",
    });
    res.cookie("accessToken", accessToken, {
      // httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json("Logged in");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  } finally {
    await client.release();
  }
}

export default signIn;