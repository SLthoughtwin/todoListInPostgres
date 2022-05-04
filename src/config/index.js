require('dotenv').config()
const { errorHandler, responseHandler } = require('./errorhandle');
const {connectDB} = require('./db.connect')
module.exports = {
    port:process.env.PORT,
    access:process.env.ACCESS_TOKEN,
    pgUser:process.env.USER_NAME,
    pgHost:process.env.HOST_NAME,
    pgPassword:process.env.PG_PASSWORD ,
    pgPort:process.env.PG_PORT,
    pgDb:process.env.DATABASE_NAME,
    connectDB,
    errorHandler,
    responseHandler
}