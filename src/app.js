const express = require('express')
const db = require('./config/db');

const app = express();

const port = process.env.PORT || 3000;

db.connect();

const route = require('./routes');
route(app);


app.get('/', function (req, res) {
    res.send('Welcome to movie search engine!!!')
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
