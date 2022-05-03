const conn = require('../database/custom_connection');

/**
 * @description establish DB connection
 * @param String DB_NAME 
 * @returns mongoose.connection
 */
module.exports = (DB_NAME) => {
    return new Promise((resolve, reject) => {
        conn(DB_NAME).then(db => resolve(db)).catch(err => {
            return reject({ code: 502, message: 'DB Connection Error' })
        })
    })
}