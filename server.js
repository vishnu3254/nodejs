const express = require('express');

const app = express();

app.use(express.json());
const auth = require('./middlewares/auth');
const userRouter = require('./routes/user.route');


app.get('/', (req,res) => {
    res.send('hello world test');
})

app.get('/protected', auth, (req, res) => {
    res.send('protected route');
})

app.use('/users', userRouter)

app.listen(3001);