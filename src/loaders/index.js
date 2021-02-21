const expressLoader = require('./express')
const mongooseLoader = require('./mogoose')

module.exports = async function (app) {
  try {

    mongooseLoader();

    await expressLoader(app);

    return app;

  } catch (error) {
    console.log(error);
  }
}