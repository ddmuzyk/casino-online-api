import jwt from 'jsonwebtoken';
const transaction = async (req, res, pool, bcrypt) => {
    const { cookies, action } = req.body;
    const cookie = req.cookies;
    // console.log('Cookie: ', cookie)
    let accessToken = cookies ? cookies.accessToken : cookie ? cookie.accessToken : null;
    // console.log(accessToken);
    if (!accessToken) {
        console.log('no token');
        res.status(401).send('Unauthorized');
        return;
    }
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            res.status(403).send('Forbidden');
            return;
        }
        req.user = user;
        // console.log(req.user);
    });
    const client = await pool.connect();
    if (action.type === 'lookup') {
        try {
            const data = await client.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
            if (data.rows.length === 0) {
                res.status(401).send('Invalid email');
                return;
            }
            // console.log(data.rows[0]);
            res.status(200).json(data.rows[0]);
        }
        catch (err) {
            res.status(500).send('Internal Server Error');
        }
        finally {
            await client.release();
        }
    }
    else if (action.type === 'update') {
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
        }
        catch (err) {
            await client.query('ROLLBACK');
            res.status(500).send('Internal Server Error');
        }
        finally {
            await client.release();
        }
    }
    else {
        res.status(400).send('Bad Request');
    }
};
export default transaction;
//# sourceMappingURL=transaction.js.map