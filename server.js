const app = require('./app');

const port = 3005;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
