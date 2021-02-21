const dotenv = require('dotenv');

const envFound = dotenv.config();
if (envFound.error) {

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 27017;
const dbName = process.env.DB_NAME || 'my_db_name';

module.exports = {
  databaseUrl:  `mongodb://${dbHost}:${dbPort}/${dbName}`,

  databaseCloudUrl: process.env.DB_CLOUD_URL,

  port: parseInt(process.env.PORT, 10),

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },
}
