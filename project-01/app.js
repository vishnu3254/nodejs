require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/users.route');
const errorHandler = require('./middlewares/errorHandler');
const {login, refresh} = require('./controllers/login.controller');
const {signUp, logout} = require('./controllers/users.controller');
const { signupSchema, loginSchema } = require('./validators/auth.validator');
const validate = require('./middlewares/validate');
const requestId = require('./middlewares/requestId');
const requestLogger = require('./middlewares/requestLogger');
const helmet = require('helmet');
const { globalLimitter } = require('./middlewares/rateLimitter');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(helmet())
app.use(requestId);
app.use(requestLogger);

app.use(globalLimitter)

app.post('/signup', validate(signupSchema), signUp);        
app.post('/login', validate(loginSchema), login);
app.post('/refresh', refresh);
app.post('/logout', logout);

app.use('/users', userRouter);

app.use(errorHandler)

module.exports = app;
