import 'dotenv/config';
import pg from 'pg';
const {Client} = pg;

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

await client.connect();

client.query('SELECT * FROM users', (err, res) => {
  if (!err) {
    console.log(res.rows)   
  }
  client.end();
});
 