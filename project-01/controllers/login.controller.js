const jwt = require("jsonwebtoken");

const login = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    const err = new Error("username and password are required");
    err.statusCode = 400;
    return next(err);
  }
  const accessToken = jwt.sign(
    { username, role: "admin" },
    process.env.ACCESS_SECRET_KEY,
    {
      expiresIn: "1h",
    },
  );
  const refreshToken = jwt.sign(
    { username, role: "admin" },
    process.env.REFRESH_SECRET_KEY,
    { expiresIn: "7d" },
  );
  res.json({ accessToken, refreshToken });
};

const refresh = (req, res, next) => {
    const {refreshToken} = req.body;
    if (!refreshToken) {
        const err = new Error('refresh token is required');
        err.statusCode = 400;
        return next(err);
    } 
    try {   
        const decodedUser = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
        const accessToken = jwt.sign(
            { username: decodedUser.username, role: decodedUser.role },
            process.env.ACCESS_SECRET_KEY,
            {
                expiresIn: "15m",
            },
        );
        res.json({ accessToken });
    } catch (err) {
        err.statusCode = 401;
        return next(err);
    }
}

module.exports = {
    login,
    refresh,
};
