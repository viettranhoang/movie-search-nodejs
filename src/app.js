const express = require('express')
const loaders = require('./loaders')
const config = require('./config')
const jobs = require('./jobs/crawl')


async function startServer() {
    const app = express();

    await loaders(app)

    app.listen(config.port, () => {
        console.log(`App listening at http://localhost:${config.port}`);
    });

    await jobs()
}

startServer()
