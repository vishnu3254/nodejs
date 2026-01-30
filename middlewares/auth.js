const auth = (req, res, next) => {
    console.log('req', req)
    const {username} = req.body;
    if(username === 'admin') {
        next();
    }
    else {
        res.status(401).send('unauthorized');
    }
}

module.exports = auth;