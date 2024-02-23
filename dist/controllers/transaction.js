import jwt from 'jsonwebtoken';
const transaction = async (req, res, pool, bcrypt) => {
    const { cookies, action } = req.body;
    let accessToken = cookies ? cookies.accessToken : null;
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
        console.log(req.user);
    });
    const client = await pool.connect();
    if (action === 'lookup') {
        try {
            const data = await client.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
            if (data.rows.length === 0) {
                res.status(401).send('Invalid email');
                return;
            }
            console.log(data.rows[0]);
            res.status(200).json(data.rows[0]);
        }
        catch (err) {
            res.status(500).send('Internal Server Error');
        }
        finally {
            await client.release();
        }
    }
};
export default transaction;
//# sourceMappingURL=transaction.js.map