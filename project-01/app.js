require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const userRouter = require('./routes/users.route');
const errorHandler = require('./middlewares/errorHandler');
const {login, refresh} = require('./controllers/login.controller');

app.use(express.json());

app.post('/login', login);
app.post('/refresh', refresh)

app.use('/users', userRouter);

app.use(errorHandler)
app.listen(3005, () => {
    console.log('server is running on port 3005');
})
