
const mongoose = require('mongoose');
const { databaseCloudUrl } = require('../config');

async function connect() {
    console.log(databaseCloudUrl);
    try {
        await mongoose.connect(databaseCloudUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log('Connect successfully!!');
    } catch (error) {
        console.log('Connect failure!!');
    }
}

const connectWithRetry = function () {
    // when using with docker, at the time we up containers. Mongodb take few seconds to starting, during that time NodeJS server will try to connect MongoDB until success.
    return mongoose.connect(
        databaseUrl,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        },
        (err) => {
            if (err) {
                console.error(
                    'Failed to connect to mongo on startup - retrying in 5 sec dfdfs ',
                    err,
                );
                setTimeout(connectWithRetry, 5000);
            }
        },
    );
};

module.exports = connect
