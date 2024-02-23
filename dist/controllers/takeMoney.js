import jwt from 'jsonwebtoken';
const transaction = async (req, res, pool, bcrypt) => {
    const { cookies, action } = req.body;
    console.log(req.body);
    let accessToken = cookies ? cookies.accessToken : null;
    if (!accessToken) {
        console.log('no token');
        res.status(401).send('Unauthorized');
        return;
    }
    let data;
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            res.status(403).send('Forbidden');
            return;
        }
        data = user;
        console.log(data);
        res.status(200).send('Money taken');
    });
    const client = await pool.connect();
};
export default transaction;
//# sourceMappingURL=takeMoney.js.map