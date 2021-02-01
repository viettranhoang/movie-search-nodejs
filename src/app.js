const express = require('express')
const loaders = require('./loaders')

const port = process.env.PORT || 3000;

async function startServer() {
    const app = express();

    await loaders(app)

    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
}

startServer()
