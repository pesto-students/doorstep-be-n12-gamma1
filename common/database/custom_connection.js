const mongoose = require('mongoose');
const { mongoDBConnectionStringCloud,databaseUser,databasePassword} =require("../../config");

module.exports = async (DB_NAME) => {
    const conn = await mongoose.createConnection(mongoDBConnectionStringCloud, {
        auth: {
            user: databaseUser,
            password: databasePassword
        },
        dbName: DB_NAME,
        // authSource: DB_NAME,
        poolSize: 1,
        socketTimeoutMS: 1000,
        family: 4,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })

    mongoose.connection.on('connected', () => {
        console.info(`mongoose successfully connected with DB: ${DB_NAME}`);
    });

    mongoose.connection.on('error', (err) => {
        console.error(`mongodb connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.info(`DB successfully dis-connected: ${DB_NAME}`);
    });

    return conn
}