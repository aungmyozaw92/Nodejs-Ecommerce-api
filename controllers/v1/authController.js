
const register = async (req, res) => {
    res.send('register page');
};

const login = async (req, res) => {
    res.send('login page');
};

const logout = async (req, res) => {
    res.send('logout page');
};

module.exports = {
    register,
    login,
    logout
};

