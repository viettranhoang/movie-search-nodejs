const express = require('express')
const axios = require('axios')
const qs = require('qs');

const Comment = require('../src/models/Comment');

const app = express();

const port = process.env.PORT || 3000;

const route = require('./routes');
route(app);

const data = { 
    __a: 1,
    fb_dtsg: 'AQHB8W_NMbKo:AQFyeC1Bq6bq',
    limit: 50,
 };


app.get('/', function (req, res) {
    res.send('Welcome to movie search engine!!!')
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
