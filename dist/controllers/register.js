const register = (req, res, client) => {
    client.query('SELECT * FROM users', (err, r) => {
        if (!err) {
            console.log(r.rows);
            res.status(200).json(r.rows);
        }
        client.end();
    });
};
export default register;
//# sourceMappingURL=register.js.map