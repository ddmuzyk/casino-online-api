const logout = async (req, res) => {
    res.clearCookie('accessToken');
    res.status(200).send('Logged out');
};
export {};
//# sourceMappingURL=logout.js.map