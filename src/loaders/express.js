const express = require('express')
const routes = require('../api')
const config = require('../config')

module.exports = async function connect(app) {

    app.get('/', function (req, res) {
        res.send('Welcome to movie search engine!!!')
    })

    routes(app)
}