const register = async (req, res, pool, bcrypt) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400).send('Bad Request');
        return;
    }
    const client = await pool.connect();
    try {
        const data = await client.query('SELECT email FROM users WHERE email = $1', [email]);
        if (data.rows.length > 0) {
            res.status(409).send('User with this email already exists');
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            await client.query('BEGIN');
            await client.query('INSERT INTO users(name, email) VALUES($1, $2)', [name, email]);
            await client.query('INSERT INTO login(email, hash) VALUES($1, $2)', [email, hashedPassword]);
            await client.query('COMMIT');
            res.status(201).json("User successfully created");
        }
        catch (err) {
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
};
export default register;
//# sourceMappingURL=register.js.map