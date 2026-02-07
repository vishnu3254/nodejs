const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
        const err = new Error('token is required');
        err.statusCode = 401;
        return next(err);
    }
    const token = bearerToken.split(' ')[1];
    try {
        const decodedUser = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
        req.user = decodedUser;
        next();
    } catch (err) {
        err.statusCode = 401;
        return next(err);
    }
}